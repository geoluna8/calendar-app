const { authSlice, onLogin, onLogout, clearErrorMessage } = require("../../../src/store/auth/authSlice");
const { initialState, authenticatedState } = require("../../fixtures/authStates");
const { testUserCredentials } = require("../../fixtures/testUser");

describe('Pruebas en el authSlice', () => {

    test('debe de regresar el estado inicial ', () => {
        expect( authSlice.getInitialState() ).toEqual( initialState );  
    });

    test('debe de realizar un login ', () => {
      
        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        // console.log(state);
        // toEqual para objetos
        // toBe para primivitos
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        });
    });

    test('debe de hacer logout ', () => {

        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });
      
    });
    
    test('debe de hacer logout con mensaje ', () => {
        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        });
      
    });

    test('debe de limpiar el mensaje de error ', () => {
        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        const newState = authSlice.reducer( state, clearErrorMessage() );
        expect( newState.errorMessage ).toBe(undefined);
    });
    
  
});
