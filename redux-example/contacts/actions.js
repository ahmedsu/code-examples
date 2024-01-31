export const CREATE_CONTACTS = 'CREATE_CONTACTS';
export const CREATE_CONTACTS_SUCCESS = 'CREATE_CONTACTS_SUCCESS';
export const CREATE_CONTACTS_FAILURE = 'CREATE_CONTACTS_FAILURE';

export const LOAD_CONTACTS = 'LOAD_CONTACTS';
export const LOAD_CONTACTS_SUCCESS = 'LOAD_CONTACTS_SUCCESS';
export const LOAD_CONTACTS_FAILURE = 'LOAD_CONTACTS_FAILURE';

export const UPDATE_CONTACTS = 'UPDATE_CONTACTS';
export const UPDATE_CONTACTS_SUCCESS = 'UPDATE_CONTACTS_SUCCESS';
export const UPDATE_CONTACTS_FAILURE = 'UPDATE_CONTACTS_FAILURE';

export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const UPDATE_CONTACT_SUCCESS = 'UPDATE_CONTACT_SUCCESS';
export const UPDATE_CONTACT_FAILURE = 'UPDATE_CONTACT_FAILURE';

export const DELETE_CONTACT = 'DELETE_CONTACT';
export const DELETE_CONTACT_SUCCESS = 'DELETE_CONTACT_SUCCESS ';
export const DELETE_CONTACT_FAILURE = 'DELETE_CONTACT_FAILURE';

export const DELETE_ALL_USER_CONTACTS = 'DELETE_ALL_USER_CONTACTS';
export const DELETE_ALL_USER_CONTACTS_SUCCESS = 'DELETE_ALL_USER_CONTACTS_SUCCESS';
export const DELETE_ALL_USER_CONTACTS_FAILURE = 'DELETE_ALL_USER_CONTACTS_FAILURE';

export const createContacts = ({ contacts }) => ({
  type: CREATE_CONTACTS,
  payload: {
    contacts,
  },
});

export const createContactsSuccess = ({ contacts }) => ({
  type: CREATE_CONTACTS_SUCCESS,
  payload: { contacts },
});

export const createContactsFailure = () => ({
  type: CREATE_CONTACTS_FAILURE,
});

export const loadContacts = ({ userId }) => ({
  type: LOAD_CONTACTS,
  payload: { userId },
});

export const loadContactsSuccess = ({ contacts }) => ({
  type: LOAD_CONTACTS_SUCCESS,
  payload: { contacts },
});

export const loadContactsFailure = () => ({
  type: LOAD_CONTACTS_FAILURE,
});

export const updateContacts = ({ contacts }) => ({
  type: UPDATE_CONTACTS,
  payload: { contacts },
});

export const updateContactsSuccess = ({ contacts }) => ({
  type: UPDATE_CONTACTS_SUCCESS,
  payload: { contacts },
});

export const updateContactsFailure = () => ({
  type: UPDATE_CONTACTS_FAILURE,
});

export const updateContact = ({ contact, oldContact }) => ({
  type: UPDATE_CONTACT,
  payload: { contact, oldContact },
});

export const updateContactSuccess = () => ({
  type: UPDATE_CONTACT_SUCCESS,
});

export const updateContactFailure = ({ oldContact }) => ({
  type: UPDATE_CONTACT_FAILURE,
  payload: { oldContact },
});

export const deleteContact = ({ contactId }) => ({
  type: DELETE_CONTACT,
  payload: { contactId },
});

export const deleteContactSuccess = ({ contactId, deletedTodoIds }) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: { contactId, deletedTodoIds },
});

export const deleteContactFailure = () => ({
  type: DELETE_CONTACT_FAILURE,
});

export const deleteAllUserContacts = () => ({
  type: DELETE_ALL_USER_CONTACTS,
});

export const deleteAllUserContactsSuccess = () => ({
  type: DELETE_ALL_USER_CONTACTS_SUCCESS,
});

export const deleteAllUserContactsFailure = () => ({
  type: DELETE_ALL_USER_CONTACTS_FAILURE,
});
