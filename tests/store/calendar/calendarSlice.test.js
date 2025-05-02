const { calendarSlice, onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onLogoutCalendar, onLoadEvents } = require("../../../src/store/calendar/calendarSlice");
const { initialState, calendarWithEventsState, events, calendarWithActiveEventState } = require("../../fixtures/calendarStates");

describe('Pruebas en calendaSlice', () => {
  
    test('debe de regresar el estado por defecto ', () => {
      
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );

    });

    test('onSetActiveEvent debe de activar el evento ', () => {
      
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        // console.log(state);
        expect( state.activeEvent ).toEqual( events[0] );

    });

    test('onAddNewEvent debe de agregar el evento ', () => {
      
        const newEvent = {
            id: 3,
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumpleaños de Geovanny!!',
            notes: 'Alguna nota!!',
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent) );
        // console.log(state);
        expect( state.events ).toEqual( [...events, newEvent] );

    });

    test('onUpdateEvent debe de actualizar el evento ', () => {
      
        const updatedEvent = {
            id: 1,
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumpleaños de Geovanny actualizado',
            notes: 'Alguna nota actualizada',
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        // console.log(state);
        expect( state.events ).toContain( updatedEvent );

    });

    test('onDeleteEvent debe de borrar el event activo ', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        // console.log(state);
        expect( state.activeEvent ).toBe( null );
        expect( state.events.length ).not.toContain( events[0] );
    });

    test('onLoadEvents debe de establecer los eventos ', () => {
      const state = calendarSlice.reducer( initialState, onLoadEvents( events ));
      expect( state.isLoadingEvents ).toBeFalsy();
      expect( state.events ).toEqual( events );

      const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
      expect( state.events.length ).toBe( events.length );
    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );
    });
 
});
