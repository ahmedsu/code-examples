import { takeLatest, select } from 'redux-saga/effects';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import { t } from 'i18n-js';

import { notificationsChannelSettings } from '../../utils/constants';
import {
  getArrayOfRepeatingTodosWithoutEvents,
  getTodoListWithRepeatingTodos,
} from '../../utils/helperFunctions';
import { getTodosWithEventsAndContacts } from '../todos/selectors';
import getContactTodoList from '../contactTodos/selectors';
import getContactList from '../contacts/selectors';
import { CREATE_NEW_NOTIFICATIONS } from './actions';
import bugsnag from '../../utils/bugsnag';
import getLearnTodoList from '../learnTodos/selectors';

const getDeletedDates = (todosArray) => {
  const todosValues = Object.values(todosArray);
  const deletedDates = [];
  for (let i = 0; i < todosValues.length; i++) {
    todosValues[i]?.content?.deletedDates?.length > 0 &&
      deletedDates.push(...todosValues[i]?.content?.deletedDates);
  }
  return [...deletedDates];
};

/**
 * @description Returns a JS Date object set to the correct time in respect to the selected notification time in redux (state.app.notificationSettings)
 * @author Ahmed Suljic
 */
const getNotificationDate = (notificationSettings, firstOffset, initialDate = Date.now()) => {
  const notificationDate = new Date(initialDate + firstOffset);
  notificationDate.setHours(0, 0, 0);
  switch (notificationSettings.time) {
    case 'morning':
      notificationDate.setHours(9);
      break;
    case 'afternoon':
      notificationDate.setHours(13);
      break;
    case 'evening':
      notificationDate.setHours(21);
      break;
    default:
      notificationDate.setHours(9);
      break;
  }
  return notificationDate;
};

/**
 * @description Creates a repeating monthly notification, the first time it will trigger is offset 15 days from the day you enable it
 * @author Ahmed Suljic
 */
const createMonthlyNotifications = (notificationSettings) => {
  const notificationDate = getNotificationDate(notificationSettings, 15 * 24 * 60 * 60 * 1000);

  PushNotification.localNotificationSchedule({
    channelId: notificationsChannelSettings.channelId,
    title: 'Scheduled Moments',
    message: t('monthlyNotificationContent'),
    repeatType: 'month',
    date: notificationDate,
    number: 1,
  });
};

/**
 * @description Creates a repeating weekly notification, the first time it will trigger is offset 3 days from the day you enable it
 * @author Ahmed Suljic
 */
const createWeeklyNotifications = (notificationSettings) => {
  const notificationDate = getNotificationDate(notificationSettings, 3 * 24 * 60 * 60 * 1000);

  PushNotification.localNotificationSchedule({
    channelId: notificationsChannelSettings.channelId,
    title: 'Scheduled Moments',
    message: t('weeklyNotificationContent'),
    repeatType: 'week',
    date: notificationDate,
    number: 1,
  });
};

/**
 * @description Returns an array of objects that will be used to create local notifications for event todos
 * @author Ahmed Suljic
 */
const getEventTodoNotificationData = (state) => {
  const todoRefs = state.referential.todoTemplates;
  let eventTodos = getTodosWithEventsAndContacts(state);
  eventTodos = eventTodos.filter((todo) => todo.event);
  eventTodos = getTodoListWithRepeatingTodos(
    eventTodos,
    moment().add(6, 'month'),
    getDeletedDates(eventTodos),
    63,
  );
  const eventTodoNotificationData = [];
  eventTodos.forEach((todo, i) => {
    let baseMessage = todoRefs[todo.content.template].en.singular;
    !baseMessage ? (baseMessage = t('baseEventNotification')) : null;
    let messageWithName;
    if (todo.contacts[0].firstName) {
      messageWithName = baseMessage.split('{name}').join(todo.contacts[0].firstName);
    } else {
      messageWithName = baseMessage.split('{name}').join('your friend');
    }
    const notificationDate = getNotificationDate(
      state.app.notificationSettings,
      todo.content.scheduledDate,
      0,
    );
    const notificationData = {
      channelId: notificationsChannelSettings.channelId,
      title: 'Scheduled Moments',
      message: messageWithName,
      date: notificationDate,
      id: i,
      allowWhileIdle: true,
      priority: 'high',
      number: 1,
    };
    eventTodoNotificationData.push(notificationData);
  });

  return eventTodoNotificationData;
};

/**
 * @description Removes all notification data objects that are either scheduled for the past or are duplicates - the duplicates are replaced with a single generic notification
 * @author Ahmed Suljic
 */
const filterSameDayNotifications = (notificationData) => {
  let allNotificationData = [...notificationData];
  allNotificationData = allNotificationData.filter(
    (notification) => notification.date.getTime() > Date.now(),
  );

  allNotificationData.forEach((notification) => {
    allNotificationData.forEach((comparedNotification) => {
      if (
        moment.unix(notification.date.getTime() / 1000).format('l') ===
          moment.unix(comparedNotification.date.getTime() / 1000).format('l') &&
        notification.id !== comparedNotification.id
      ) {
        const multipleEventsNotification = {
          ...notification,
          message: t('multipleTodosNotification'),
        };
        allNotificationData = allNotificationData.filter(
          (filterNotification) =>
            moment.unix(filterNotification.date.getTime() / 1000).format('l') !==
            moment.unix(notification.date.getTime() / 1000).format('l'),
        );

        allNotificationData.push(multipleEventsNotification);
      }
    });
  });

  return allNotificationData;
};

/**
 * @description Creates notifications only for event todos
 * @author Ahmed Suljic
 */
const createOnlyEventNotifications = (state) => {
  let allNotificationData = getEventTodoNotificationData(state);
  allNotificationData.sort((a, b) => a.date.getTime() - b.date.getTime());
  allNotificationData = allNotificationData.splice(0, 63);
  allNotificationData = filterSameDayNotifications(allNotificationData);
  allNotificationData.forEach((notification, i) => {
    const notificationIndex = allNotificationData.findIndex(
      (notif) => notif.id === notification.id,
    );
    allNotificationData[notificationIndex] = { ...notification, number: i + 1 };
  });
  allNotificationData.forEach((notification) => {
    PushNotification.localNotificationSchedule(notification);
  });
};

/**
 * @description Returns an array of objects that will be used to create local notifications for contact todos
 * @author Ahmed Suljic
 */
const getContactTodoNotificationData = (state) => {
  const contactTodoRefs = state.referential.contactTodoTemplates;
  const contactTodoList = getContactTodoList(state);
  const contactList = getContactList(state);
  const repeatedContactTodos = contactTodoList
    .map((todo) => getArrayOfRepeatingTodosWithoutEvents(todo, moment().add(6, 'month'), [], 63))
    .flat(1);
  const contactIdNameDictionary = {};
  contactList.forEach((contact) => {
    contactIdNameDictionary[contact.id] = contact.firstName;
  });

  const contactNotificationData = [];
  repeatedContactTodos.forEach((todo, i) => {
    let baseMessage = contactTodoRefs[todo.content.template].en;
    !baseMessage ? (baseMessage = t('baseContactTodosNotification')) : null;
    let messageWithName;
    if (contactIdNameDictionary[todo.content.contactId]) {
      messageWithName = baseMessage
        .split('{name}')
        .join(contactIdNameDictionary[todo.content.contactId]);
    } else {
      messageWithName = baseMessage.split('{name}').join('your friend');
    }
    const notificationDate = getNotificationDate(
      state.app.notificationSettings,
      todo.content.scheduledDate,
      0,
    );
    const notificationData = {
      channelId: notificationsChannelSettings.channelId,
      title: 'Scheduled Moments',
      message: messageWithName,
      date: notificationDate,
      id: i + 100,
      allowWhileIdle: true,
      priority: 'high',
      number: 1,
    };
    contactNotificationData.push(notificationData);
  });

  return contactNotificationData;
};

/**
 * @description Returns an array of objects that will be used to create local notifications for learn todos
 * @author Ahmed Suljic
 */
const getLearnTodoNotificationData = (state) => {
  const learnTodoRefs = state.referential.learnTodoTemplates;
  const learnTodoList = getLearnTodoList(state);
  const repeatedLearnTodos = learnTodoList
    .map((todo) => getArrayOfRepeatingTodosWithoutEvents(todo, moment().add(6, 'month'), [], 63))
    .flat(1);
  const learnNotificationData = [];
  repeatedLearnTodos.forEach((todo, i) => {
    let baseMessage = learnTodoRefs[todo.content.template]?.en;
    !baseMessage ? (baseMessage = t('baseLearnTodosNotification')) : null;
    const notificationDate = getNotificationDate(
      state.app.notificationSettings,
      todo.content.scheduledDate,
      0,
    );
    const notificationData = {
      channelId: notificationsChannelSettings.channelId,
      title: 'Scheduled Moments',
      message: baseMessage,
      date: notificationDate,
      id: i + 200,
      allowWhileIdle: true,
      priority: 'high',
      number: 1,
    };
    learnNotificationData.push(notificationData);
  });

  return learnNotificationData;
};

/**
 * @description Creates notifications for all todos
 * @author Ahmed Suljic
 */
const createSuperSocialNotifications = (state) => {
  const contactTodoNotificationData = getContactTodoNotificationData(state);
  const eventTodoNotificationData = getEventTodoNotificationData(state);
  const learnTodoNotificationData = getLearnTodoNotificationData(state);
  let allNotificationData = contactTodoNotificationData
    .concat(eventTodoNotificationData)
    .concat(learnTodoNotificationData);
  allNotificationData.sort((a, b) => a.date.getTime() - b.date.getTime());
  allNotificationData = allNotificationData.splice(0, 63);
  allNotificationData = filterSameDayNotifications(allNotificationData);
  allNotificationData.forEach((notification, i) => {
    const notificationIndex = allNotificationData.findIndex(
      (notif) => notif.id === notification.id,
    );
    allNotificationData[notificationIndex] = { ...notification, number: i + 1 };
  });
  allNotificationData.forEach((notification) => {
    PushNotification.localNotificationSchedule(notification);
  });
};

/**
 * @description Create new notifications according to notificationSettings
 * @author Ahmed Suljic
 */
function* createNewNotificationsSaga() {
  try {
    const notificationSettings = yield select((state) => state.app.notificationSettings);
    const reduxState = yield select((state) => state);

    PushNotification.cancelAllLocalNotifications();

    switch (notificationSettings.frequency) {
      case 'onceMonth':
        createMonthlyNotifications(notificationSettings);
        break;
      case 'onceWeek':
        createWeeklyNotifications(notificationSettings);
        break;
      case 'onlyEvent':
        createOnlyEventNotifications(reduxState);
        break;
      case 'superSocial':
        createSuperSocialNotifications(reduxState);
        break;
    }
  } catch (e) {
    bugsnag.notify(e, `Error creating notifications`);
  }
}

function* createNewNotificationsSagaWatcher() {
  yield takeLatest(CREATE_NEW_NOTIFICATIONS, createNewNotificationsSaga);
}

/**
 * Exports
 */
export default [createNewNotificationsSagaWatcher];
