export const SET_SELECTED_CALENDARS = 'SELECTED_CALENDARS';
export const SET_CALENDAR_EVENTS_LIST = 'SET_CALENDAR_EVENTS_LIST';

export const setSelectedCalendars = (calendars) => ({
  type: SET_SELECTED_CALENDARS,
  payload: calendars,
});

export const setCalendarEventsList = (eventsList) => ({
  type: SET_CALENDAR_EVENTS_LIST,
  payload: eventsList,
});
