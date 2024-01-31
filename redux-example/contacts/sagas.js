import * as _ from 'lodash';
import { takeLatest, put, select, all, call } from 'redux-saga/effects';
import { t } from 'i18n-js';
import { Keyboard } from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import momentRandom from 'moment-random';

import {
  CREATE_CONTACTS,
  createContactsSuccess,
  createContactsFailure,
  LOAD_CONTACTS,
  loadContacts,
  loadContactsSuccess,
  loadContactsFailure,
  UPDATE_CONTACTS,
  updateContactsSuccess,
  updateContactsFailure,
  UPDATE_CONTACT,
  updateContactSuccess,
  updateContactFailure,
  DELETE_CONTACT,
  deleteContactSuccess,
  deleteContactFailure,
  DELETE_ALL_USER_CONTACTS,
  deleteAllUserContactsFailure,
  deleteAllUserContactsSuccess,
} from './actions';
import { createEvent } from '../events/actions';
import {
  setLoading,
  setLoadingList,
  setHasUnscoredContacts,
  setShowNoConnection,
} from '../app/actions';
import { createContactTodo } from '../contactTodos/actions';

import bugsnag from '../../utils/bugsnag';
import { navigate } from '../../utils/navigationService';
import {
  formatArrayToObject,
  getNextOnboardingRoute,
  getBirthdayScheduledDate,
  getDeviceContacts,
  removeEmptyProperties,
  formatReminderScheduledDate,
  showGeneralErrorAlert,
  snapshotToArray,
  batchDelete,
  isConnected,
  getDateForEvent,
} from '../../utils/helperFunctions';

/**
 * @description Loads user's contacts from the database
 * Ahmed Suljic Ahmed Suljic
 */
function* loadContactsSaga(action) {
  yield put(setLoadingList({ loadingList: true, loadingListType: 'contacts' }));
  const { userId } = action.payload;

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }

    const { skipOnboarding, contactsPermission } = yield select((state) => state.app);

    const result = yield firestore().collection('contacts').where('userId', '==', userId).get();

    let contacts = snapshotToArray(result, 'id');
    const unscoredContacts = [];

    // If contacts permission is enabled, get device contacts for redux state, otherwise DB contacts
    if (contactsPermission === 'authorized') {
      const deviceContacts = yield getDeviceContacts();

      // Merge database and device contact information
      contacts = contacts.map((contact) => {
        const deviceContact = deviceContacts.find((item) => item.id === contact.id);
        return { ...contact, ...deviceContact };
      });
    }
    for (let i = 0; i < contacts.length; i++) {
      if (!contacts[i].hasScored) unscoredContacts.push(contacts[i]);
    }
    yield put(setHasUnscoredContacts([...unscoredContacts]));
    yield put(
      loadContactsSuccess({
        contacts: formatArrayToObject(contacts, 'id'),
      }),
    );
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));

    // Dismiss keyboard before navigating. Might be a bug in RN navigation @5.5.0
    Keyboard.dismiss();

    // If onboarding is finished navigate to app
    if (skipOnboarding) {
      return navigate('App');
    }

    return navigate(getNextOnboardingRoute());
  } catch (e) {
    yield put(loadContactsFailure());
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));
    bugsnag.notify(e, `Error loading contacts for ${userId}`);
  }
}

/**
 * @description Saves selected contacts in the database in batches of 500
 * Ahmed Suljic Ahmed Suljic
 */
function* createContactsSaga(action) {
  yield put(setLoadingList({ loadingList: true, loadingListType: 'contacts' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { contacts } = action.payload;
    const { id } = yield select((state) => state.user);
    const {
      messageTemplates: { birthday, anniversary, wedding },
      eventTypes,
    } = yield select((state) => state.referential);
    const { reminders } = eventTypes.birthday;
    const remindersAnniversary = eventTypes.anniversary.reminders;
    const remindersWedding = eventTypes.wedding.reminders;
    const remindersMeeting = eventTypes.meeting.reminders;
    const remindersCoffee = eventTypes.coffee.reminders;
    const remindersDrinks = eventTypes.drinks.reminders;
    const remindersLunch = eventTypes.lunch.reminders;
    const remindersDinner = eventTypes.dinner.reminders;

    const currentDate = +moment();

    const contactsForDB = contacts.map((contact) => ({
      id: contact.id,
      userId: id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.company,
      hasScored: contact.hasScored,
      color: contact.color,
    }));
    // Batch only works for a max of 500 documents at a time, so we split
    // contacts in multiple batches of 500 each
    const batches = _.chunk(contactsForDB, 500).map((contactDocs) => {
      // Create a new batch instance
      const batch = firestore().batch();

      contactDocs.map(({ id: contactId, userId, firstName, lastName, company, hasScored, color }) =>
        batch.set(
          firestore().collection('contacts').doc(contactId),
          removeEmptyProperties({
            userId,
            firstName,
            lastName,
            company,
            hasScored,
            color,
          }),
        ),
      );
      return batch.commit();
    });

    yield Promise.all(batches);
    yield put(
      createContactsSuccess({
        contacts: formatArrayToObject(contacts, 'id'),
      }),
    );
    yield put(loadContacts({ userId: id }));
    // Create birthday events for contacts with birthdays
    yield all(
      contacts
        .filter((item) => item.createBirthday)
        .map((contact) => {
          if (contact.birthday) {
            const scheduledDate = getBirthdayScheduledDate({
              day: contact.birthday.day,
              // JS months start from 0 so we add 1
              month: contact.birthday.month + 1,
              year: contact.birthday.year,
            });
            return put(
              createEvent({
                event: {
                  contacts: [contact.id],
                  emoji: '🥳',
                  type: 'birthday',
                  scheduledDate,
                  repeatMode: 'yearly',
                  message: {
                    text: birthday ? birthday[moment.locale()] : t('happyBirthday'),
                  },
                },
                todos: reminders.map((todo) => ({
                  ...todo,
                  scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                  deletedDates:
                    formatReminderScheduledDate(todo, scheduledDate) < +moment()
                      ? [formatReminderScheduledDate(todo, scheduledDate)]
                      : [],
                  completedDates: [],
                  eventDate: scheduledDate,
                  repeatMode: 'yearly',
                })),
              }),
            );
          }
          return null;
          // TODO: what to do with contacts for which we want to have birthday, but no birthday info is added?
        }),
    );
    // Create events for contacts with events defineded
    const calls = yield [];
    yield contacts
      .filter((item) => item?.dates?.length > 0)
      .map((contact) => {
        const anniversaryIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'anniversary',
        );
        const weddingIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'wedding',
        );
        const meetingIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'meeting',
        );
        const coffeeIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'coffee',
        );
        const drinksIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'drinks',
        );
        const lunchIndex = contact.dates.findIndex((item) => item.label.toLowerCase() === 'lunch');
        const dinnerIndex = contact.dates.findIndex(
          (item) => item.label.toLowerCase() === 'dinner',
        );

        if (anniversaryIndex > -1) {
          const scheduledDate = getBirthdayScheduledDate({
            day: contact.dates[anniversaryIndex]?.day,
            // JS months start from 0 so we add 1
            month: contact.dates[anniversaryIndex]?.month + 1,
            year: contact.dates[anniversaryIndex]?.year,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'anniversary',
                    emoji: '🎉',
                    scheduledDate,
                    repeatMode: 'yearly',
                    message: {
                      text: anniversary ? anniversary[moment.locale()] : t('happyAnniversary'),
                    },
                  },
                  todos: remindersAnniversary.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'yearly',
                  })),
                }),
              ),
            );
          }
        }
        if (weddingIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[weddingIndex].day,
            month: contact.dates[weddingIndex].month,
          });

          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    emoji: '💍',
                    type: 'wedding',
                    scheduledDate,
                    message: {
                      text: wedding ? wedding[moment.locale()] : t('happyWedding'),
                    },
                  },
                  repeatMode: 'none',
                  todos: remindersWedding.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        if (meetingIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[meetingIndex].day,
            month: contact.dates[meetingIndex].month,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'meeting',
                    emoji: '📅',
                    scheduledDate,
                  },
                  repeatMode: 'none',
                  todos: remindersMeeting.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        if (coffeeIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[coffeeIndex].day,
            month: contact.dates[coffeeIndex].month,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'coffee',
                    emoji: '☕️',
                    scheduledDate,
                  },
                  repeatMode: 'none',
                  todos: remindersCoffee.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        if (drinksIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[drinksIndex].day,
            month: contact.dates[drinksIndex].month,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'drinks',
                    emoji: '🍹',
                    scheduledDate,
                  },
                  repeatMode: 'none',
                  todos: remindersDrinks.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        if (lunchIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[lunchIndex].day,
            month: contact.dates[lunchIndex].month,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'lunch',
                    emoji: '🌭',
                    scheduledDate,
                  },
                  repeatMode: 'none',
                  todos: remindersLunch.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        if (dinnerIndex > -1) {
          const scheduledDate = getDateForEvent({
            day: contact.dates[dinnerIndex].day,
            month: contact.dates[dinnerIndex].month,
          });
          if (scheduledDate >= currentDate) {
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [contact.id],
                    type: 'dinner',
                    emoji: '🍽',
                    scheduledDate,
                  },
                  repeatMode: 'none',
                  todos: remindersDinner.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'none',
                  })),
                }),
              ),
            );
          }
        }
        return null;
        // TODO: what to do with contacts for which we want to have birthday, but no birthday info is added?
      });
    yield all(calls);
    // Create default contact related todos for contacts
    yield all(
      contacts
        .filter((item) => !item.hasScored)
        .map((contact) => {
          return put(
            createContactTodo({
              todo: {
                template: 'noneFilled',
                repeatMode: 1,
                scheduledDate: momentRandom(moment().add(6, 'months'), moment()).valueOf(),
                contactId: contact.id,
                completedDates: [],
                deletedDates: [],
              },
              userId: id,
            }),
          );
        }),
    );
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));
  } catch (e) {
    yield put(createContactsFailure());
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));
    bugsnag.notify(e, 'Error creating contacts');
  }
}

/**
 * @description Update contacts information in database and locally. (Called every time the app has come to foreground)
 * Ahmed Suljic Ahmed Suljic
 */
function* updateContactsSaga(action) {
  yield put(setLoading({ loading: true, loadingType: 'contacts' }));
  try {
    const currentDate = +moment();
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { contacts: deviceContacts } = action.payload;
    const userId = yield select((state) => state.user.id);
    const { messageTemplates, eventTypes } = yield select((state) => state.referential);
    const { reminders } = eventTypes.birthday;

    // Get events for contacts
    const resultUserEvents = yield firestore()
      .collection('events')
      .where('userId', '==', userId)
      .get();
    const userEventsFromDB = snapshotToArray(resultUserEvents, 'id');

    const currentDbContacts = Object.values(yield select((state) => state.contacts));

    // Merge device contact info with that of the database
    const mergedContacts = currentDbContacts.map((item) => {
      const deviceContact = deviceContacts.find((contact) => contact.id === item.id) || {};
      return { ...item, ...deviceContact };
    });

    // Find any contacts for which first name, last name or company name has changed on the device
    // (only these need to be updated in the database):
    const calls = yield [];
    const contactsForDB = yield currentDbContacts
      .map((element) => {
        if (deviceContacts.find((item) => item.id === element.id) === undefined) return null;
        const newInfo = removeEmptyProperties(
          deviceContacts.find((item) => item.id === element.id),
        );
        // Get list of events for specific contact
        const contactEvents = userEventsFromDB.filter((el) => el?.contacts?.includes(element.id));
        if (
          element.firstName !== newInfo.firstName ||
          element.lastName !== newInfo.lastName ||
          element.company !== newInfo.company ||
          !_.isEqual(element?.birthday, newInfo?.birthday) ||
          !_.isEqual(element?.socialProfiles, newInfo?.socialProfiles) ||
          !_.isEqual(element?.dates, newInfo?.dates)
        ) {
          // If birthday is changed
          if (
            newInfo?.birthday &&
            element?.birthday &&
            !_.isEqual(element?.birthday, newInfo?.birthday)
          ) {
            const scheduledDate = getBirthdayScheduledDate({
              day: newInfo.birthday.day,
              // JS months start from 0 so we add 1
              month: newInfo.birthday.month + 1,
              year: newInfo.birthday.year,
            });
            calls.push(
              put(
                createEvent({
                  event: {
                    contacts: [newInfo.id],
                    emoji: '🥳',
                    type: 'birthday',
                    scheduledDate,
                    repeatMode: 'yearly',
                    message: {
                      text: messageTemplates?.birthday
                        ? messageTemplates?.birthday[moment.locale()]
                        : t('happyBirthday'),
                    },
                  },
                  todos: reminders.map((todo) => ({
                    ...todo,
                    scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                    deletedDates:
                      formatReminderScheduledDate(todo, scheduledDate) < +moment()
                        ? [formatReminderScheduledDate(todo, scheduledDate)]
                        : [],
                    completedDates: [],
                    eventDate: scheduledDate,
                    repeatMode: 'yearly',
                  })),
                }),
              ),
            );
          }
          // If dates are changed we need to add or remove events related to that date
          if (!_.isEqual(element?.dates, newInfo?.dates)) {
            newInfo?.dates.forEach((el) => {
              const scheduledDate = getDateForEvent({
                day: el.day,
                month: el.month,
              });
              const eventIndex = contactEvents.findIndex(
                (item) =>
                  item?.scheduledDate === scheduledDate && item?.type === el?.label?.toLowerCase(),
              );
              // If event already doesn't exist create one
              if (
                eventIndex === -1 &&
                `${el.label.toLowerCase()}` in eventTypes &&
                scheduledDate > currentDate
              ) {
                calls.push(
                  put(
                    createEvent({
                      event: removeEmptyProperties({
                        contacts: [newInfo.id],
                        emoji: eventTypes[el.label.toLowerCase()].emoji,
                        type: eventTypes[el.label?.toLowerCase()],
                        scheduledDate,
                        repeatMode: eventTypes[el.label?.toLowerCase()].repeatMode,
                        message: messageTemplates[el.label?.toLowerCase()]?.en
                          ? {
                              text: messageTemplates[el.label?.toLowerCase()]?.en,
                            }
                          : null,
                      }),
                      todos: eventTypes[el.label?.toLowerCase()]?.reminders?.map((todo) =>
                        removeEmptyProperties({
                          ...todo,
                          scheduledDate: formatReminderScheduledDate(todo, scheduledDate),
                          deletedDates:
                            formatReminderScheduledDate(todo, scheduledDate) < +moment()
                              ? [formatReminderScheduledDate(todo, scheduledDate)]
                              : [],
                          completedDates: [],
                          eventDate: scheduledDate,
                          repeatMode: eventTypes[el.label.toLowerCase()]?.repeatMode || 'none',
                        }),
                      ),
                    }),
                  ),
                );
              }
            });
          }
          return {
            id: element.id,
            firstName: newInfo.firstName,
            lastName: newInfo.lastName,
            company: newInfo.company,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    yield all(calls);

    if (contactsForDB.length) {
      // Batch only works for a max of 500 documents at a time, so we split
      // contactsForDB in multiple batches of 500 each
      const batches = _.chunk(contactsForDB, 500).map((contactDocs) => {
        // Create a new batch instance
        const batch = firestore().batch();
        contactDocs.map(({ id, firstName, lastName, company }) =>
          batch.update(
            firestore().collection('contacts').doc(id),
            removeEmptyProperties({
              firstName,
              lastName,
              company,
            }),
          ),
        );
        return batch.commit();
      });

      yield Promise.all(batches);
    }

    yield put(
      updateContactsSuccess({
        contacts: formatArrayToObject(mergedContacts, 'id'),
      }),
    );
    yield put(setLoading({ loading: false, loadingType: 'contacts' }));
  } catch (e) {
    yield put(updateContactsFailure());
    yield put(setLoading({ loading: false, loadingType: 'contacts' }));
    bugsnag.notify(e, 'Error updating contacts');
  }
}

/**
 * @description Updates a contact in the database
 * Ahmed Suljic Ahmed Suljic
 */
function* updateContactSaga(action) {
  yield put(setLoading({ loading: true, loadingType: 'contacts' }));
  const { contact, oldContact } = action.payload;
  const {
    id,
    importance,
    interests,
    relationships,
    notes,
    scoreTodoRemoved,
    birthdayTodoRemoved,
    hasScored,
  } = contact;

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    yield firestore().collection('contacts').doc(id).update(
      removeEmptyProperties({
        importance,
        interests,
        relationships,
        notes,
        scoreTodoRemoved,
        birthdayTodoRemoved,
        hasScored,
      }),
    );
    yield put(updateContactSuccess());
    yield put(setLoading({ loading: false, loadingType: 'contacts' }));
  } catch (e) {
    yield put(updateContactFailure({ oldContact }));
    yield put(setLoading({ loading: false, loadingType: 'contacts' }));
    showGeneralErrorAlert();
    bugsnag.notify(e, `Error updating contact ${id}`);
  }
}

/**
 * @description Deletes contact from database
 * TODO: When contact specific todos are implemented these will need to be deleted too
 * TODO: Improve error handling - what should happen if one of the delete operations fails
 * Ahmed Suljic Ahmed Suljic
 */
function* deleteContactSaga(action) {
  yield put(setLoadingList({ loadingList: true, loadingListType: 'contacts' }));
  const { contactId } = action.payload;

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { id: userId } = yield select((state) => state.user);
    const resultContactEvents = yield firestore()
      .collection('events')
      .where('contacts', 'array-contains', contactId)
      .get();

    const resultUserTodos = yield firestore()
      .collection('todos')
      .where('content.userId', '==', userId)
      .get();

    const contactEvents = snapshotToArray(resultContactEvents, 'id', true);
    const userTodos = snapshotToArray(resultUserTodos, 'id', true);

    // If the event has multiple contacts, update the event and remove the contact from the contacts array
    const toBeUpdatedEvents = contactEvents.filter((item) => item.contacts.length > 1);

    // If the event has only the deleted contact, delete the event
    const toBeDeletedEvents = contactEvents.filter((item) => item.contacts.length === 1);

    // Delete any event specific todos for the events that are about to be deleted
    const toBeDeletedTodos = userTodos.filter((todo) =>
      toBeDeletedEvents.some((item) => item.id === todo.content.eventId),
    );
    const toBeDeletedContactTodos = userTodos.filter(
      (todo) => todo?.content?.contactId === contactId,
    );

    // Delete todos
    yield batchDelete(toBeDeletedTodos);

    // Delete contact related todos
    yield batchDelete(toBeDeletedContactTodos);

    // Delete events
    yield batchDelete(toBeDeletedEvents);

    // Update events in batches
    const eventUpdateBatches = _.chunk(toBeUpdatedEvents, 500).map((docs) => {
      // Create a new batch instance
      const batch = firestore().batch();

      docs.forEach(({ ref, contacts: eventContacts }) =>
        batch.update(ref, {
          contacts: eventContacts.filter((item) => item !== contactId),
        }),
      );
      return batch.commit();
    });

    yield Promise.all(eventUpdateBatches);

    // Delete the contact itself
    yield firestore().collection('contacts').doc(contactId).delete();

    yield put(
      deleteContactSuccess({
        contactId,
        deletedTodoIds: toBeDeletedTodos.concat(toBeDeletedContactTodos).map(({ id }) => id),
      }),
    );
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));
  } catch (e) {
    yield put(deleteContactFailure());
    yield put(setLoadingList({ loadingList: false, loadingListType: 'contacts' }));
    showGeneralErrorAlert();
    bugsnag.notify(e, `Error deleting contact ${contactId}`);
  }
}

/**
 * @description Wipes the user's contacts from firebase, used for the remove account feature
 * Ahmed Suljic Ahmed Suljic
 */
function* deleteAllUserContactsSaga() {
  try {
    const { id: userId } = yield select((state) => state.user);
    const contactsQuerySnapshot = yield firestore()
      .collection('contacts')
      .where('userId', '==', userId)
      .get();
    const batch = firestore().batch();
    contactsQuerySnapshot.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    batch.commit();
    yield put(deleteAllUserContactsSuccess());
  } catch (e) {
    yield put(deleteAllUserContactsFailure());
    bugsnag.notify(e, `Error deleting all user's contacts`);
  }
}

/**
 * Saga watchers
 */
function* loadContactsSagaWatcher() {
  yield takeLatest(LOAD_CONTACTS, loadContactsSaga);
}

function* createContactsSagaWatcher() {
  yield takeLatest(CREATE_CONTACTS, createContactsSaga);
}

function* updateContactsSagaWatcher() {
  yield takeLatest(UPDATE_CONTACTS, updateContactsSaga);
}

function* updateContactSagaWatcher() {
  yield takeLatest(UPDATE_CONTACT, updateContactSaga);
}

function* deleteContactSagaWatcher() {
  yield takeLatest(DELETE_CONTACT, deleteContactSaga);
}

function* deleteAllUserContactsSagaWatcher() {
  yield takeLatest(DELETE_ALL_USER_CONTACTS, deleteAllUserContactsSaga);
}

/**
 * Exports
 */
export default [
  loadContactsSagaWatcher,
  createContactsSagaWatcher,
  updateContactsSagaWatcher,
  updateContactSagaWatcher,
  deleteContactSagaWatcher,
  deleteAllUserContactsSagaWatcher,
];
