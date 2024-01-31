import { createSelector } from 'reselect';

const getEvents = (state) => state.events;
const getContacts = (state) => state.contacts;

/**
 * @description Returns a memoized event list with contacts (Used to prevent unnecessary re-renders in EventModal.js)
 * @author Ahmed Suljic
 */
const getEventList = createSelector([getEvents, getContacts], (events, contacts) =>
  Object.values(events).map((event) => ({
    ...event,
    contacts: event.contacts.map((contactId) => (contacts[contactId] ? contacts[contactId] : {})),
  })),
);

export default getEventList;
