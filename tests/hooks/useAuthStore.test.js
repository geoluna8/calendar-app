import { act, renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { useAuthStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState },
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        // console.log(result);
      
        expect( result.current ).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
          });
    });

    test('startLogin debe de realizar el login correctamente ', async () => {
      // localStorage.clear();
      const mockStore = getMockStore({ ...notAuthenticatedState });

      const { result } = renderHook( () => useAuthStore(), {
        wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
    });

    await act( async () => {
        await result.current.startLogin( testUserCredentials );
    });

    const { errorMessage, user, status } = result.current;
    // console.log(result.current);

    expect( { errorMessage, user, status } ).toEqual({
        errorMessage: undefined,
        user: { name: 'Test User', uid: '681063e2a2889d845404844b' },
        status: 'authenticated',
    });

    expect( localStorage.getItem('token')).toEqual( expect.any(String) );
    expect( localStorage.getItem('token-init-date')).toEqual( expect.any(String) );

    });

    test('startLogin debe de fallar la autenticación', async () => {
    // localStorage.clear();
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook( () => useAuthStore(), {
        wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
    });

    await act( async () => {
        await result.current.startLogin( { email: 'algo@google.com', password: '123456789'} );
    });

    const { errorMessage, user, status } = result.current;
    // console.log(result.current);  
    expect( localStorage.getItem('token')).toBe(null);
    expect( { errorMessage, user, status } ).toEqual({
        status: 'not-authenticated',
        user: {},
        errorMessage: 'Error al iniciar sesión'   
    });

    waitFor(
        () => expect( result.current.errorMessage ).toBe(undefined)
    );

    });

    test('startRegister debe de crear un usuario ', async () => {

        const newUser = { email: 'algo@google.com', password: '123456789', name: 'Test User 2' };
    
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: 'j1n23j21n31',
                name: 'Test User 2',
                token: 'ABC-123'
            }
        });
    
        await act( async () => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, user, status } = result.current;
        // console.log( { errorMessage, user, status } );

        expect( { errorMessage, user, status } ).toEqual(
            {
            errorMessage: undefined,
            user: { name: 'Test User 2', uid: 'j1n23j21n31' },
            status: 'authenticated'
            });

        spy.mockRestore();
    });
    
    test('startRegister debe de fallar la creacion ', async () => {
    
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async () => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, user, status } = result.current;
        // console.log( { errorMessage, user, status } );

        expect( { errorMessage, user, status } ).toEqual(
            {
            errorMessage: 'El correo ya está registrado',
            user: {},
            status: 'not-authenticated'
        });
      
    });

    test('checkAuthToken debe de fallar si no hay un token ', async () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        // console.log('token', localStorage.getItem('token'));

        await act( async () => {
            await result.current.checkAuthToken( testUserCredentials );
        });

        const { errorMessage, user, status } = result.current;
        expect( { errorMessage, user, status } ).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken debe de autenticar si hay token ', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        // console.log(data);

        localStorage.setItem('token', data.token );

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken( testUserCredentials );
        });

        const { errorMessage, user, status } = result.current;
        // console.log( { errorMessage, user, status } );
        expect( { errorMessage, user, status } ).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {name: "Test User", uid: "681063e2a2889d845404844b"}
        });
    });
  
});
