import { createSelector } from 'reselect';

const getContacts = (state) => state.contacts;
const getCalendarEvents = (state) => state.calendarEvents.calendarEventsList;

/**
 * @description Returns a memoized contact list
 */
export const getContactList = createSelector([getContacts], (contacts) => {
  return Object.values(contacts);
});

/**
 * @description Returns a memoized events list
 */
export const getCalendarEventsList = createSelector([getCalendarEvents], (events) => {
  return Object.values(events);
});

/**
 * @description Returns a memoized events list only for contacts which are added to the app
 * @author Ahmed Suljic
 */
export const getCalendarEventsForContactsInApp = createSelector(
  [getContactList, getCalendarEventsList],
  (contacts, events) => {
    const eventsToReturn = [];
    // Choose events which title includes firstName and lastName or attendees email contains email of selected contact
    events.forEach((event) => {
      const contactsToAttach = [];
      contacts?.forEach((contact) => {
        if (
          (event.title.toLowerCase().includes(contact?.firstName?.toLowerCase()) &&
            event.title.toLowerCase().includes(contact?.lastName?.toLowerCase())) ||
          event?.attendees?.some((attendee) =>
            contact?.emails?.some((emailAdd) => emailAdd?.email === attendee?.email),
          )
        ) {
          contactsToAttach.push(contact);
        }
      });
      contactsToAttach.length > 0 &&
        eventsToReturn.push({ ...event, contacts: [...contactsToAttach] });
    });
    return eventsToReturn;
  },
);
