import { SET_SELECTED_CALENDARS, SET_CALENDAR_EVENTS_LIST } from './actions';

const initialState = {
  selectedCalendars: [],
  calendarEventsList: [],
};

export default function calendarEventsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_SELECTED_CALENDARS:
      return {
        ...state,
        selectedCalendars: payload,
      };
    case SET_CALENDAR_EVENTS_LIST:
      return {
        ...state,
        calendarEventsList: payload,
      };
    default:
      return state;
  }
}
