import { createSelector } from 'reselect';

const getContacts = (state) => state.contacts;

/**
 * @description Returns a memoized contact list (used to prevent unnecessary re-renders in EventModal.js )
 * @author Ahmed Suljic
 */
const getContactList = createSelector([getContacts], (contacts) => Object.values(contacts));

export default getContactList;
