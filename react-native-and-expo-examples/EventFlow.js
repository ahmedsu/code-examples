import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { t } from "i18n-js";
import _ from "lodash";
import PropTypes from "prop-types";
import { Animated, Alert, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import * as Contacts from "expo-contacts";
import DeviceInfo from "react-native-device-info";

import SelectContacts from "../../modalComponents/SelectContacts";
import AddTextField from "../../modalComponents/AddTextField";
import SelectEventType from "../../modalComponents/SelectEventType";
import SelectDate from "../../modalComponents/SelectDate";
import SelectTime from "../../modalComponents/SelectTime";
import SelectRepeatMode from "../../modalComponents/SelectRepeatMode";
import SelectRepeatEnd from "../../modalComponents/SelectRepeatEnd";
import EventOverview from "../../modalComponents/EventOverview";
import SelectReminders from "../../modalComponents/SelectReminders";
import SelectReminderDate from "../../modalComponents/SelectReminderDate";
import SelectReminderTime from "../../modalComponents/SelectReminderTime";
import AddContact from "../../modalComponents/AddContact";
import AddComposedMessage from "../../modalComponents/AddComposedMessage";
import PersonaliseModal from "../../modals/PersonaliseModal";
import SubscriptionModal from "../../modals/SubscriptionModal";

import { EventContext, UPDATE_STATE } from "../../contexts/EventContext";
import {
  ComposeMessageContext,
  UPDATE_MESSAGE_STATE,
} from "../../contexts/ComposeMessageContext";

import {
  removeKeys,
  getNextEventDate,
  formatReminderScheduledDate,
  screenHeight,
  getContactsByIds,
} from "../../utils/helperFunctions";
import {
  createEvent as createEventAction,
  updateEvent as updateEventAction,
  updateRepeatingEventAndTodos as updateRepeatingEventAndTodosAction,
} from "../../redux/events/actions";
import {
  createTodo as createTodoAction,
  updateTodo as updateTodoAction,
  deleteTodo as deleteTodoAction,
} from "../../redux/todos/actions";
import { updateContact } from "../../redux/contacts/actions";
import getContactList from "../../redux/contacts/selectors";
import { getTodoList } from "../../redux/todos/selectors";

import {
  SELECT_CONTACTS,
  ADD_MESSAGE,
  ADD_NOTE,
  SELECT_EVENT_TYPE,
  SELECT_DATE,
  SELECT_TIME,
  SELECT_REPEAT_MODE,
  SELECT_REPEAT_END,
  SELECT_REMINDERS,
  SELECT_REMINDER_DATE,
  SELECT_REMINDER_TIME,
  EVENT_OVERVIEW,
  ADD_CONTACT,
  PERSONALISE,
  SUBSCRIBE,
  todosTypes,
  getComposedMessageSubjects,
  getRelationCircles,
  getSharedInterests,
} from "../../utils/constants";
import bugsnag from "../../utils/bugsnag";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const BOTTOM_NOTCH = DeviceInfo.hasNotch() ? 34 : 0;
const MARGIN_TOP = 44;

const MAX_MODAL_HEIGHT = screenHeight - MARGIN_TOP - BOTTOM_NOTCH;

function EventFlow(props) {
  const {
    todos,
    selectedEvent,
    contacts = [],
    onDismiss,
    onLayout,
    messageTemplates,
    eventTypes,
    createEvent,
    updateEvent,
    updateRepeatingEventAndTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    preselectedContact,
    preselectedEventType,
    changeCalendarCurrentDate,
    disableBackPressFromAddMessage,
  } = props;

  const {
    currentScreen,
    event,
    reminders,
    currentDate,
    eventFlowFinished,
    customReminderDate,
    dispatch,
  } = useContext(EventContext);

  const { dispatchMsg } = useContext(ComposeMessageContext);

  const fadeInAnimation = useRef(new Animated.Value(0)).current;

  const reduxContacts = useSelector((state) => state.contacts);
  const reduxDispatch = useDispatch();

  const [triggerAIComposer, setTriggerAIComposer] = useState(false);
  const [withoutTyping, setWithoutTyping] = useState(false);

  const selectedEventTodos = useMemo(() => {
    const eventTodos = selectedEvent
      ? Object.values(todos).filter(
          (item) => item.content.eventId === selectedEvent.id
        )
      : [];

    // If it is a repeating event get todos for each event instance
    if (selectedEvent && selectedEvent.repeatMode !== "none") {
      // Group all event todos by their template
      const eventTodosGroupedByTemplate = eventTodos.reduce((acc, curr) => {
        return acc[curr.content.template]
          ? {
              ...acc,
              [curr.content.template]: [...acc[curr.content.template], curr],
            }
          : { ...acc, [curr.content.template]: [curr] };
      }, {});
      // For each todo template, get the todo that was scheduled exactly for this event
      // Or otherwise the most recent one
      const eventInstanceTodos = Object.entries(eventTodosGroupedByTemplate)
        .map(([key, value]) => {
          const eventTodo = value.find(
            (item) => item.content.eventDate === selectedEvent.scheduledDate
          );
          if (eventTodo) {
            return eventTodo;
          } else {
            return value.reduce(
              (acc, curr) =>
                acc.eventDate > curr.content.eventDate
                  ? removeKeys(acc, ["id"])
                  : removeKeys(curr, ["id"]),
              {}
            );
          }
        })
        .flat();

      // Adjust the scheduledDate of the todos (always needs to be relative to the selected event date)
      return eventInstanceTodos.map((item) => ({
        ...item,
        eventDate: selectedEvent.scheduledDate,
        scheduledDate: +moment(selectedEvent.scheduledDate).add(
          item.scheduledDate - item.eventDate
        ),
      }));
    }
    return eventTodos;
  }, [selectedEvent, todos]);

  const repeatingEventFutureTodos = useMemo(() => {
    return selectedEvent
      ? Object.values(todos).filter(
          (item) =>
            item.eventId === selectedEvent.id && item.scheduledDate >= +moment()
        )
      : [];
  }, [selectedEvent, todos]);

  /**
   * @description
   * @author Ahmed Suljic
   */
  const updateContextState = useCallback(
    (attributes) => {
      dispatch({ type: UPDATE_STATE, payload: { ...attributes } });
    },
    [dispatch]
  );
  /**
   * @description Resets the modal to initial state
   * @author Ahmed Suljic
   */
  const resetModal = useCallback(() => {
    if (selectedEvent) {
      updateContextState({
        currentScreen: EVENT_OVERVIEW,
        reminders: selectedEventTodos,
        event: selectedEvent,
        eventFlowFinished: true,
        customReminderDate: new Date(),
      });
    } else {
      updateContextState({
        currentScreen: SELECT_CONTACTS,
        reminders: [],
        event: {},
        eventFlowFinished: false,
        customReminderDate: new Date(),
      });
    }
  }, [selectedEvent, selectedEventTodos, updateContextState]);

  /**
   * @description Initializes the modal content depending on whether there is a selectedEvent (edit mode) or not
   * @author Ahmed Suljic
   */
  useEffect(() => {
    resetModal();
  }, [resetModal]);

  /**
   * @description If Event Flow is opened from Contact Detail modal, it will have preselected contact, and we should update local event with the contact id
   * If event flow is opened from Social feed, based on action, contact and precomposed message event type can be selected
   * @author Ahmed Suljic
   */
  useEffect(() => {
    if (preselectedContact)
      updateLocalEvent({ contacts: preselectedContact }, SELECT_CONTACTS);

    if (preselectedEventType) {
      updateLocalEvent(
        {
          type: preselectedEventType.eventType.type,
          emoji: preselectedEventType.eventType.emoji,
          contacts: preselectedContact,
        },
        ADD_MESSAGE
      );
      updateLocalRemindersOnEventTypeChange(
        preselectedEventType.eventType.automaticReminders
      );
    }
  }, [
    preselectedContact,
    updateLocalEvent,
    eventTypes,
    preselectedEventType,
    updateLocalRemindersOnEventTypeChange,
  ]);

  /**
   * @description Updates event (and its reminders) in the local state and renders the next modal screen
   * @author Ahmed Suljic
   */
  const updateLocalEvent = useCallback(
    (attributes, nextRoute, secondaryPress) => {
      updateContextState({ event: { ...event, ...attributes } });
      // If event date has changed when editing an event, update also event reminder scheduled dates
      // and allow only future reminders
      if (
        selectedEvent &&
        attributes.scheduledDate &&
        attributes.scheduledDate !== selectedEvent.scheduledDate
      ) {
        const difference =
          selectedEvent.scheduledDate - attributes.scheduledDate;
        updateContextState({
          reminders: selectedEventTodos.map((item) => ({
            ...item,
            content: {
              ...item.content,
              eventDate: attributes.scheduledDate,
              scheduledDate: item.content.scheduledDate - difference,
            },
          })),
        });
      }

      // If event repeat mode has gone from 'none' to repeating, update repeatMode of reminders
      if (
        selectedEvent &&
        attributes.repeatMode &&
        attributes.repeatMode !== selectedEvent.repeatMode &&
        attributes.repeatMode !== "none"
      ) {
        updateContextState({
          reminders: reminders.map((item) => ({
            ...item,
            content: {
              ...item.content,
              repeatMode: event.repeatMode,
              repeatEndDate: event.repeatEndDate,
            },
          })),
        });
      }

      updateContextState({
        currentScreen:
          eventFlowFinished && !secondaryPress ? EVENT_OVERVIEW : nextRoute,
      });

      // If event overview has been reached, set eventFlowFinished to true (used for proper back navigation from other components))
      if (nextRoute === EVENT_OVERVIEW) {
        updateContextState({ eventFlowFinished: true });
      }
    },
    [
      selectedEvent,
      event,
      eventFlowFinished,
      reminders,
      selectedEventTodos,
      updateContextState,
    ]
  );

  /**
   * @description Updates event reminders in local state
   * @param {Array} newReminders
   * @param {string} nextRoute
   * @author Ahmed Suljic
   */
  const updateLocalReminders = (newReminders, nextRoute) => {
    const eventSpecificReminder = reminders.find(
      (item) =>
        (item?.content ? item?.content.template : item.template) === event.type
    );
    const newFutureReminders = newReminders.filter(
      (item) => item.scheduledDate >= +moment()
    );

    updateContextState({
      reminders: eventSpecificReminder
        ? [...newFutureReminders, eventSpecificReminder]
        : newFutureReminders,
      currentScreen: nextRoute,
    });
  };

  /**
   * @description Called when an event type is selected. Updates local reminders based on event type.
   * If event is being edited and the event scheduledDate is also available, format scheduledDate and
   * eventDate for the new reminders and only allow creating future reminders
   * @param {Array} eventTypeReminders
   * @author Ahmed Suljic
   */
  const updateLocalRemindersOnEventTypeChange = useCallback(
    (eventTypeReminders) => {
      const customReminder = reminders.find(
        (item) => item.template === "custom"
      );
      const newReminders = customReminder
        ? [...eventTypeReminders, customReminder]
        : eventTypeReminders;

      updateContextState({
        reminders: event.scheduledDate
          ? newReminders
              .map((item) => ({
                ...item,
                scheduledDate: formatReminderScheduledDate(
                  item?.content ? item?.content : item,
                  event.scheduledDate
                ),
                eventDate: event.scheduledDate,
              }))
              .filter((item) => item.scheduledDate >= +moment())
          : newReminders,
      });
    },
    [event.scheduledDate, reminders, updateContextState]
  );
  /**
   * @description Creates a new event and event reminders in the database
   * @param {*} updatedEvent
   * @param {*} eventTodos
   * @author Ahmed Suljic
   */
  const createNewEvent = () => {
    createEvent({
      event,
      todos: [
        ...reminders.map((todo) => ({
          ...todo,
          eventDate: event.scheduledDate,
          scheduledDate: formatReminderScheduledDate(
            todo?.content ? todo?.content : todo,
            event.scheduledDate
          ),
          repeatMode: event.repeatMode,
          repeatEndDate: event.repeatEndDate,
          snoozedDates: [],
          deletedDates: [],
        })),
      ],
    });
    // If user is on EventScreen and adds new event, after closing the modal, calendar should show the date of the event
    !!changeCalendarCurrentDate &&
      changeCalendarCurrentDate(
        moment(event?.scheduledDate).format("YYYY-MM-DD")
      );
    clearContextState();
    resetModal();
    onDismiss();
  };

  /**
   * @description Get any new, deleted or updated event reminders when an event is being edited
   * @author Ahmed Suljic
   */
  const getChangedReminders = () => {
    //  Get any new event reminders
    const newReminders = reminders
      .filter(
        (item) =>
          !selectedEventTodos.find((todo) => todo.template === item.template)
      )
      .map((todo) => ({ ...todo, change: "created" }));

    // Get any deleted event reminders
    const deletedReminders = selectedEventTodos
      .filter(
        (item) => !reminders.find((todo) => todo.template === item.template)
      )
      .map((todo) => ({ ...todo, change: "deleted" }));

    // Get any updated event reminders - todos that are not new or deleted, but have changed
    const updatedReminders = reminders
      .filter(
        (item) =>
          !deletedReminders.find((todo) => todo.template === item.template) &&
          !newReminders.find((todo) => todo.template === item.template)
      )
      .filter(
        (todo) =>
          !_.isEqual(
            todo,
            selectedEventTodos.find((item) => item.template === todo.template)
          )
      )
      .map((todo) => ({ ...todo, change: "updated" }));

    return [...deletedReminders, ...newReminders, ...updatedReminders];
  };

  /**
   * @description Update contact details on device (birthday or dates) if user changes event related to those info
   * @param {object} contactToUpdate
   * @param {object} contactInfo
   * @param {object} newDate
   * @param {object} newContactInfo
   */
  const updateContactOnDevice = async (
    contactToUpdate,
    contactInfo,
    newDate,
    newContactInfo
  ) => {
    await Contacts.updateContactAsync(contactToUpdate)
      .then((res) => {
        reduxDispatch(
          updateContact({
            contact: newContactInfo
              ? { ...newContactInfo }
              : { ...contactInfo, ...newDate },
            oldContact: { ...contactInfo },
          })
        );
        if (event.repeatMode !== "none") {
          editAllFutureRepeatingEvents();
        } else {
          updateEvent({ event });
          updateEventTodos();
        }
      })
      .catch((e) => bugsnag.notify("Error updating contact on device", e));
  };

  /**
   * @description Updates an already existing event and it's todos in the database
   * @author Ahmed Suljic
   */
  const updateSelectedEvent = async () => {
    const changedReminders = getChangedReminders();
    // Only if the event or its reminders have changed -  update the changes in the database
    if (!_.isEqual(event, selectedEvent) || !!changedReminders.length) {
      // If edited event is created automatically while adding a contact, edit contact on device too
      if (
        event.createdByDeviceContact &&
        event.scheduledDate !== selectedEvent.scheduledDate
      ) {
        const contactInfo = reduxContacts[event?.contacts[0]];
        const scheduledDateMonth = moment(event.scheduledDate).month();
        const scheduledDateDay = moment(event.scheduledDate).date();
        // If birthday is changed, change only birthday othervise change the date from 'dates' array
        if (event.type === "birthday") {
          const newBirthday = {
            month: scheduledDateMonth,
            day: scheduledDateDay,
            format: "gregorian",
          };
          // Update contact on device and in the app
          const contactToUpdate = {
            id: contactInfo.id,
            [Contacts.Fields.Birthday]: { ...newBirthday },
          };
          // For automatic events we can only edit all repeating events
          Alert.alert(
            t("editRepeatingEventAlertTitle"),
            t("editRepeatingEventAlertDescriptionAutomaticEvents"),
            [
              {
                text: t("allFutureEvents"),
                onPress: () =>
                  updateContactOnDevice(contactToUpdate, contactInfo, {
                    birthday: { ...newBirthday },
                  }),
              },
              {
                text: t("cancel"),
                onPress: () => {},
                style: "cancel",
              },
            ]
          );
        } else {
          // If the event is created from dates list
          const contactInfoCopy = _.cloneDeep(contactInfo);
          const changedDate = contactInfoCopy.dates.filter(
            (item) => item.label === event.type
          )[0];
          const changedDateIndex = contactInfoCopy.dates.findIndex(
            (item) => item.id === changedDate.id
          );
          contactInfoCopy.dates[changedDateIndex] = {
            ...contactInfoCopy.dates[changedDateIndex],
            month: scheduledDateMonth,
            day: scheduledDateDay,
          };
          const contactToUpdate = {
            id: contactInfo.id,
            [Contacts.Fields.Dates]: [...contactInfoCopy.dates],
          };
          Alert.alert(
            t("editRepeatingEventAlertTitle"),
            t("editRepeatingEventAlertDescriptionAutomaticEvents"),
            [
              {
                text: t("allFutureEvents"),
                onPress: () =>
                  updateContactOnDevice(
                    contactToUpdate,
                    contactInfo,
                    null,
                    contactInfoCopy
                  ),
              },
              {
                text: t("cancel"),
                onPress: () => {},
                style: "cancel",
              },
            ]
          );
        }
      } else {
        // If edited event is repeating, edit either one or all future event instances and their reminders
        if (selectedEvent.repeatMode !== "none") {
          Alert.alert(
            t("editRepeatingEventAlertTitle"),
            t("editRepeatingEventAlertDescription"),
            [
              {
                text: t("allFutureEvents"),
                onPress: () => editAllFutureRepeatingEvents(),
              },
              {
                text: t("onlyOnce"),
                onPress: () => editRepeatingEventInstance(),
              },
              {
                text: t("cancel"),
                onPress: () => {},
                style: "cancel",
              },
            ]
          );
        } else {
          updateEvent({ event });
          updateEventTodos();
          onDismiss();
        }
      }
    } else {
      // If nothing changed, just close the modal:
      onDismiss();
    }
  };

  /**
   * @description Updates, deletes or creates new todos for an edited event
   * @author Ahmed Suljic
   */
  const updateEventTodos = () => {
    const changedReminders = getChangedReminders();
    changedReminders.map((todo) => {
      switch (todo.change) {
        case "created":
          return createTodo({
            todo: {
              ...todo,
              eventDate: event.scheduledDate,
              repeatMode: event.repeatMode,
              repeatEndDate: event.repeatEndDate,
              scheduledDate: formatReminderScheduledDate(
                todo,
                event.scheduledDate
              ),
              deletedDates: [],
              snoozedDates: [],
            },
            eventId: event.id,
            type: todosTypes.eventTodos,
          });
        case "deleted":
          return deleteTodo({ todo: { ...todo, id: todo.id } });
        case "updated":
          return updateTodo({
            todo: {
              ...todo,
              eventDate: event.scheduledDate,
              repeatMode: event.repeatMode,
              repeatEndDate: event.repeatEndDate,
            },
          });
        default:
          return null;
      }
    });
  };

  /**
   * @description If there are any todos that already exist in the database for a future event instance they need to be scheduled in
   * together with the new edited event todos (unless the todo in question has been deleted)
   * @author Ahmed Suljic
   */
  const getNewFutureInstanceTodo = (futureInstancTodos) => {
    let newTodos = futureInstancTodos;

    // If the todo has been deleted, add a property to show that the reminder has to be deleted
    // and ignore any other changes that would affect this todo
    newTodos = newTodos.map((item) => {
      return !reminders.find((todo) => todo.template === item.template)
        ? {
            ...item,
            change: "deleted",
          }
        : item;
    });

    // If the todo has not been deleted and event's repeatMode has changed adjust the repeatMode
    // and scheduledDate of the todo.
    newTodos = newTodos.map((item) => {
      if (
        event.repeatMode !== selectedEvent.repeatMode &&
        item.change !== "deleted"
      ) {
        const nextEventDate = getNextEventDate(
          event.repeatMode,
          event.scheduledDate
        );
        const offset = item.eventDate - item.scheduledDate;
        return {
          ...item,
          repeatMode: event.repeatMode,
          eventDate: nextEventDate,
          scheduledDate: nextEventDate - offset,
        };
      }
    });

    // If todo has not been deleted and event's repeatEndDate has changed
    // Adjust the repeatEndDate of the todo
    newTodos = newTodos.map((item) => {
      if (
        event.repeatEndDate !== selectedEvent.repeatEndDate &&
        item.change !== "deleted"
      ) {
        return {
          ...item,
          repeatEndDate: event.repeatEndDate,
        };
      }
    });

    return newTodos;
  };

  /**
   * @description Edits one repeating event instance and its reminders. The old repeating event is stopped,
   * a new non-repeating event is created for the singular edited instance and a new repeating event is created to start
   * from the next scheduled event instance date
   * @author Ahmed Suljic
   */
  const editRepeatingEventInstance = () => {
    const now = +moment();

    const oldEvent = {
      ...selectedEvent,
      repeatEndDate: +moment(selectedEvent.scheduledDate).subtract(1, "day"),
    };

    const newEventInstance = {
      ...removeKeys(event, ["id", "repeatEndDate", "nextRepeatDate"]),
      repeatMode: "none",
    };

    const newEventDate = getNextEventDate(
      selectedEvent.repeatMode,
      selectedEvent.scheduledDate
    );

    const newEvent = {
      ...removeKeys(selectedEvent, ["id"]),
      scheduledDate: newEventDate,
    };

    const pastTodos = selectedEventTodos
      .filter(
        (item) =>
          item.eventDate === selectedEvent.scheduledDate &&
          item.scheduledDate < now
      )
      .map((todo) => ({
        ...todo,
        eventDate: event.scheduledDate,
      }));

    // New todos for the singular edited event instance
    const newInstanceTodos = reminders.map((item) => ({
      ...removeKeys(item, ["id", "repeatEndDate"]),
      repeatMode: "none",
      scheduledDate:
        (item?.content ? item?.content.scheduledDate : item.scheduledDate) ||
        formatReminderScheduledDate(
          item?.content ? item?.content : item,
          event.scheduledDate
        ),
    }));

    // New todos for the new event
    const newTodos = selectedEventTodos.map((item) => {
      return {
        ...removeKeys(item, "id"),
        eventDate: newEventDate,
        scheduledDate: newEventDate + item.scheduledDate - item.eventDate,
        repeatMode: selectedEvent.repeatMode,
        repeatEndDate: selectedEvent.repeatEndDate,
      };
    });

    // If edited event instance has any past todos these need to be deleted from DB
    const todosToBeDeleted = [
      ...repeatingEventFutureTodos.filter(
        (item) => item.eventDate >= selectedEvent.scheduledDate
      ),
      ...pastTodos,
    ];

    // If there are any future todos already existing in database that are scheduled for an older event instance
    // these need to be updated to stop their repeat before the newly created edited event
    const todosToBeUpdated = repeatingEventFutureTodos.filter(
      (item) => item.eventDate < selectedEvent.scheduledDate
    );

    updateRepeatingEventAndTodos({
      oldEvent,
      newEventInstance,
      newEvent,
      newInstanceTodos,
      newTodos,
      todosToBeDeleted,
      todosToBeUpdated,
    });
    onDismiss();
  };

  /**
   * @description Edits all future instances of a repeating event and its reminders.
   * Old event is stopped, old event's future todos deleted and a new event with new todos is created.
   * @author Ahmed Suljic
   */
  const editAllFutureRepeatingEvents = () => {
    const now = +moment();

    const oldEvent = {
      ...selectedEvent,
      repeatEndDate: +moment(selectedEvent.scheduledDate).subtract(1, "day"),
    };

    const newEvent = {
      ...removeKeys(event, ["id"]),
    };

    const pastTodos = selectedEventTodos
      .filter(
        (item) =>
          item.eventDate === selectedEvent.scheduledDate &&
          item.scheduledDate < now
      )
      .map((todo) => ({
        ...todo,
        eventDate: event.scheduledDate,
      }));

    // New todos for the new edited event
    let newTodos = reminders
      .filter((item) => item.scheduledDate >= now)
      .map((item) => ({
        ...removeKeys(item, ["id"]),
        repeatMode: event.repeatMode,
        repeatEndDate: event.repeatMode === "none" ? null : event.repeatEndDate,
      }));

    const alreadyInDBFutureEventInstanceTodo = repeatingEventFutureTodos.filter(
      (item) => item.eventDate > selectedEvent.scheduledDate
    );

    // If there are already any todos in the database scheduled for the next event instance they may
    // need to be added to newTodos (depending on the changes made in the edited event)
    if (alreadyInDBFutureEventInstanceTodo) {
      const newFutureTodos = getNewFutureInstanceTodo(
        alreadyInDBFutureEventInstanceTodo
      );

      newFutureTodos.map((item) => {
        if (
          item.change !== "deleted" &&
          item.scheduledDate >= now &&
          (!event.repeatEndDate || item.scheduledDate <= event.repeatEndDate)
        ) {
          newTodos = [...newTodos, removeKeys(item, ["id"])];
        }
      });
    }

    // If edited event has any past todos these need to be deleted from DB and created together with new todos,
    // to give them the reference to the newly created eventId
    if (pastTodos.length) {
      newTodos = [...newTodos, ...pastTodos].map((item) =>
        removeKeys(item, ["id"])
      );
    }

    const todosToBeDeleted = [
      ...repeatingEventFutureTodos.filter(
        (item) => item.eventDate >= selectedEvent.scheduledDate
      ),
      ...pastTodos,
    ];

    const todosToBeUpdated = repeatingEventFutureTodos.filter(
      (item) => item.eventDate < selectedEvent.scheduledDate
    );

    updateRepeatingEventAndTodos({
      oldEvent,
      newTodos,
      newEvent,
      todosToBeDeleted,
      todosToBeUpdated,
    });
    onDismiss();
  };

  /**
   * @description Creates/updates custom set reminder for the event
   * @param {*} scheduledDate
   * @param {*} nextRoute
   * @author Ahmed Suljic
   */
  const updateCustomReminder = (scheduledDate, nextRoute) => {
    const customReminder = reminders.find((item) =>
      item?.content
        ? item.content.template === "custom"
        : item.template === "custom"
    );
    updateContextState({
      // Update the existing custom reminder
      reminders: customReminder
        ? [
            ...reminders.filter((item) =>
              item?.content
                ? item.content.template !== "custom"
                : item.template !== "custom"
            ),
            { ...customReminder, scheduledDate },
          ]
        : // Create a new custom reminder
          [
            ...reminders,
            {
              template: "custom",
              scheduledDate,
              eventDate: event.scheduledDate,
            },
          ],
      currentScreen: nextRoute,
    });
  };

  /**
   * @description Clears custom reminder from event reminders
   * @author Ahmed Suljic
   */
  const clearCustomReminder = () => {
    updateContextState({
      reminders: reminders.filter((item) =>
        item?.content
          ? item?.content?.template !== "custom"
          : item.template !== "custom"
      ),
      customReminderDate: new Date(),
      currentScreen: EVENT_OVERVIEW,
    });
  };

  const updateMessageContextState = useCallback(
    (attributes) => {
      dispatchMsg({ type: UPDATE_MESSAGE_STATE, payload: { ...attributes } });
    },
    [dispatchMsg]
  );

  /**
   *
   */
  const navigateBack = (originalRoute, eventFlowFinishedRoute) => {
    eventFlowFinished && eventFlowFinishedRoute
      ? updateContextState({ currentScreen: eventFlowFinishedRoute })
      : updateContextState({ currentScreen: originalRoute });
  };
  /**
   * @description Set default message for "Add message" page
   * @returns default message
   * @author Ahmed Suljic
   */
  const getMessageValue = () => {
    if (event?.message?.text) return event?.message?.text;
    else if (messageTemplates[event?.type]) {
      return (
        messageTemplates[event?.type][moment.locale()] ||
        messageTemplates[event?.type].en ||
        ""
      );
    } else return "";
  };
  /**
   * @description Preselect message topic based on todo/event type
   * @author Ahmed Suljic
   */
  const preselectMessageTopic = (eventType) => {
    if (
      getComposedMessageSubjects()?.some((topic) => topic.value === eventType)
    ) {
      updateMessageContextState({ messageTopic: eventType });
    } else if (
      getRelationCircles()?.some((relation) => relation.value === eventType)
    ) {
      updateMessageContextState({ relation: eventType });
    } else if (
      getSharedInterests()?.some((interest) => interest.value === eventType)
    ) {
      updateMessageContextState({ interests: eventType });
    }
  };

  const clearContextState = useCallback(async () => {
    updateMessageContextState({
      composedMessage: "",
      isMessageComposed: false,
      interests: "",
      lastContact: "",
      messageTopic: "",
      relation: "",
      customMessageTopic: "",
      language: "",
      languageValue: "",
      removeSpacing: "",
      removeSalutation: "",
      removeClosing: "",
      addEmoji: "",
      selectedOther: [],
    });
  }, [updateMessageContextState]);

  /**
   * @description Renders current step with props
   * @author Ahmed Suljic
   */
  const getCurrentStepProps = () => {
    switch (currentScreen) {
      case SELECT_CONTACTS:
        return {
          safeArea: true,
          component: (
            <SelectContacts
              onDismiss={onDismiss}
              onBackPress={
                eventFlowFinished ? () => navigateBack(EVENT_OVERVIEW) : null
              }
              contacts={contacts}
              selectedContacts={event.contacts}
              onPressNext={(selectedContacts) =>
                updateLocalEvent(
                  { contacts: selectedContacts },
                  SELECT_EVENT_TYPE
                )
              }
              onNewContactPress={() => updateLocalEvent({}, ADD_CONTACT)}
            />
          ),
        };
      case SELECT_EVENT_TYPE:
        return {
          component: (
            <SelectEventType
              onDismiss={onDismiss}
              eventTypes={eventTypes}
              onBackPress={() => navigateBack(SELECT_CONTACTS, EVENT_OVERVIEW)}
              onPressNext={({
                type,
                repeatMode,
                automaticReminders,
                emoji,
              }) => {
                updateLocalEvent(
                  {
                    type,
                    emoji,
                    // If event is being edited, only update repeatMode, when the new selected event type has a specific repeatMode
                    repeatMode:
                      !!selectedEvent &&
                      selectedEvent.repeatMode !== "none" &&
                      repeatMode === "none"
                        ? selectedEvent.repeatMode
                        : repeatMode,
                  },
                  ADD_MESSAGE
                );
                updateLocalRemindersOnEventTypeChange(automaticReminders);
                preselectMessageTopic(type);
              }}
            />
          ),
        };
      case ADD_MESSAGE:
        return {
          component: selectedEvent ? (
            <AddTextField
              onDismiss={onDismiss}
              onPressNext={(text) =>
                updateLocalEvent({ message: { text } }, SELECT_DATE)
              }
              onPressSkip={() => navigateBack(SELECT_DATE, EVENT_OVERVIEW)}
              onBackPress={() => {
                event.message && updateLocalEvent({ message: {} });
                navigateBack(SELECT_EVENT_TYPE, EVENT_OVERVIEW);
              }}
              showSkip={
                !eventFlowFinished &&
                event?.type !== "precomposedmessage" &&
                selectedEvent?.content?.type !== "precomposedmessage"
              }
              showClear={eventFlowFinished && !!event.message}
              messageTemplate={messageTemplates[event.type]}
              value={event.message ? event.message.text : null}
            />
          ) : (
            <AddComposedMessage
              fromEventFlow
              title={t("addEvent")}
              description={t("selectEventMessageDescription")}
              buttonLabel={t("next")}
              value={getMessageValue()}
              onBackPress={() => {
                if (disableBackPressFromAddMessage) {
                  onDismiss();
                } else {
                  event.message && updateLocalEvent({ message: {} });
                  navigateBack(SELECT_EVENT_TYPE, EVENT_OVERVIEW);
                  clearContextState();
                }
              }}
              onClosePress={() => {}}
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onSendPress={(text) =>
                updateLocalEvent({ message: { text } }, SELECT_DATE)
              }
              onPersonalisePress={() => updateLocalEvent({}, PERSONALISE)}
              triggerAIComposer={triggerAIComposer}
              setTriggerAIComposer={(e) => setTriggerAIComposer(e)}
              contact={getContactsByIds(contacts, event?.contacts)}
              onComposePress={(value) => updateMessageContextState(value)}
              showSkip={
                !eventFlowFinished &&
                event?.type !== "precomposedmessage" &&
                selectedEvent?.content?.type !== "precomposedmessage"
              }
              onSkipPress={() => navigateBack(SELECT_DATE, EVENT_OVERVIEW)}
              withoutTyping={
                withoutTyping || eventFlowFinished || !!event.message
              }
              setIsWithoutTyping={(value) => setWithoutTyping(value)}
            />
          ),
        };
      case ADD_NOTE:
        return {
          backRoute: EVENT_OVERVIEW,
          component: (
            <AddTextField
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              placeholder={t("note")}
              description={t("addEventNoteDescription")}
              buttonLabel={t("addNote")}
              clearButtonLabel={t("clearNote")}
              onBackPress={() =>
                navigateBack(SELECT_EVENT_TYPE, EVENT_OVERVIEW)
              }
              onPressNext={(note) => updateLocalEvent({ note }, EVENT_OVERVIEW)}
              value={event.note}
            />
          ),
        };
      case SELECT_DATE:
        return {
          safeArea: true,
          component: (
            <SelectDate
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onBackPress={() => {
                navigateBack(ADD_MESSAGE, EVENT_OVERVIEW);
                setWithoutTyping(true);
              }}
              onPressNext={({ scheduledDate, allDay }) =>
                updateLocalEvent({ scheduledDate, allDay }, SELECT_REPEAT_MODE)
              }
              onSecondaryPress={({ scheduledDate, allDay }) =>
                updateLocalEvent({ scheduledDate, allDay }, SELECT_TIME, true)
              }
              valueDate={event.scheduledDate}
              valueCalendarDate={currentDate}
              allDay={event.allDay}
            />
          ),
        };
      case SELECT_TIME:
        return {
          safeArea: true,
          component: (
            <SelectTime
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onPressNext={({ scheduledDate, allDay }) =>
                updateLocalEvent({ scheduledDate, allDay }, SELECT_REPEAT_MODE)
              }
              onSecondaryPress={({ scheduledDate, allDay }) =>
                updateLocalEvent({ scheduledDate, allDay }, SELECT_REPEAT_MODE)
              }
              onBackPress={() => navigateBack(SELECT_DATE)}
              valueDate={event.scheduledDate}
              allDay={event.allDay}
            />
          ),
        };
      case SELECT_REPEAT_MODE:
        return {
          safeArea: true,
          component: (
            <SelectRepeatMode
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onBackPress={() =>
                navigateBack(
                  event.allDay ? SELECT_DATE : SELECT_TIME,
                  EVENT_OVERVIEW
                )
              }
              onPressNext={({ repeatMode, repeatEndDate }) =>
                updateLocalEvent(
                  {
                    repeatMode,
                    repeatEndDate,
                  },
                  EVENT_OVERVIEW
                )
              }
              onSecondaryPress={({ repeatMode }) =>
                updateLocalEvent(
                  {
                    repeatMode,
                  },
                  SELECT_REPEAT_END,
                  true
                )
              }
              valueRepeatMode={event.repeatMode}
              valueRepeatEndDate={event.repeatEndDate}
            />
          ),
        };
      case SELECT_REPEAT_END:
        return {
          safeArea: true,
          component: (
            <SelectRepeatEnd
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onBackPress={() => navigateBack(SELECT_REPEAT_MODE)}
              onPressNext={({ repeatEndDate }) =>
                updateLocalEvent({ repeatEndDate }, EVENT_OVERVIEW)
              }
              onSecondaryPress={({ repeatEndDate }) =>
                updateLocalEvent({ repeatEndDate }, EVENT_OVERVIEW)
              }
              valueDate={event.scheduledDate}
              valueRepeatMode={event.repeatMode}
              valueRepeatEndDate={event.repeatEndDate}
            />
          ),
        };
      case SELECT_REMINDERS:
        return {
          safeArea: true,
          component: (
            <SelectReminders
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              eventTypes={eventTypes}
              valueType={event.type}
              valueEventDate={event.scheduledDate}
              valueAutomaticReminders={reminders.filter((item) =>
                item?.content
                  ? item?.content?.template?.includes("after") ||
                    item?.content?.template?.includes("before")
                  : item?.template?.includes("after") ||
                    item?.template?.includes("before")
              )}
              valueCustomReminder={reminders.find((item) =>
                item?.content
                  ? item?.content?.template === "custom"
                  : item?.template === "custom"
              )}
              onBackPress={() => navigateBack(EVENT_OVERVIEW)}
              onPressNext={(eventReminders) =>
                updateLocalReminders(eventReminders, EVENT_OVERVIEW)
              }
              onCustomReminderPress={(eventReminders) =>
                updateLocalReminders(eventReminders, SELECT_REMINDER_DATE)
              }
            />
          ),
        };
      case SELECT_REMINDER_DATE:
        return {
          safeArea: true,
          component: (
            <SelectReminderDate
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onPressNext={(scheduledDate) =>
                updateCustomReminder(scheduledDate, EVENT_OVERVIEW)
              }
              onSecondaryPress={(reminderDate) => [
                updateContextState({
                  customReminderDate: reminderDate,
                  currentScreen: SELECT_REMINDER_TIME,
                }),
              ]}
              // If event has no future automatic reminders, navigate straight back to EVENT_OVERVIEW
              onBackPress={() =>
                navigateBack(
                  eventTypes[event.type] &&
                    eventTypes[event.type].reminders &&
                    eventTypes[event.type].reminders.length
                    ? SELECT_REMINDERS
                    : EVENT_OVERVIEW
                )
              }
              onClearPress={() => clearCustomReminder()}
              valueCustomReminderDate={customReminderDate}
              valueCustomReminder={reminders.find(
                (item) => item.template === "custom"
              )}
            />
          ),
        };
      case SELECT_REMINDER_TIME:
        return {
          safeArea: true,
          component: (
            <SelectReminderTime
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              onPressNext={(scheduledDate) =>
                updateCustomReminder(scheduledDate, EVENT_OVERVIEW)
              }
              onBackPress={() => navigateBack(SELECT_REMINDER_DATE)}
              valueDate={event.scheduledDate}
              valueCustomReminderDate={customReminderDate}
              valueCustomReminder={reminders.find(
                (item) => item.template === "custom"
              )}
            />
          ),
        };
      case ADD_CONTACT:
        return {
          component: (
            <AddContact
              fromModal
              isVisible={true}
              onDismiss={() => updateLocalEvent({}, SELECT_CONTACTS)}
              setIsVisible={() => updateLocalEvent({}, SELECT_CONTACTS)}
              setSubscriptionModal={() => navigateBack(SUBSCRIBE)}
              navigateBack={() => {}}
            />
          ),
        };
      case PERSONALISE:
        return {
          component: (
            <View style={{ height: MAX_MODAL_HEIGHT }}>
              <PersonaliseModal
                selectedContact={getContactsByIds(contacts, event?.contacts)}
                onBackPress={() => {
                  updateLocalEvent({}, ADD_MESSAGE);
                  setTriggerAIComposer(true);
                }}
                onSelect={(value) => {
                  updateMessageContextState(value);
                }}
                onClosePress={() => {
                  updateLocalEvent({}, ADD_MESSAGE);
                  setWithoutTyping(true);
                  setTriggerAIComposer(false);
                }}
              />
            </View>
          ),
        };
      case SUBSCRIBE:
        return {
          component: (
            <SubscriptionModal
              isVisible={true}
              onDismiss={() => {
                updateLocalEvent({}, ADD_CONTACT);
              }}
              withoutRestorePurchase
            />
          ),
        };

      default:
        return {
          component: (
            <EventOverview
              onPressNext={() =>
                selectedEvent ? updateSelectedEvent() : createNewEvent()
              }
              onDismiss={() => {
                onDismiss();
                clearContextState();
              }}
              editMode={!!selectedEvent}
              editDisabled={
                !!selectedEvent &&
                (selectedEvent.allDay
                  ? selectedEvent.scheduledDate < +moment().startOf("day")
                  : selectedEvent.scheduledDate < +moment())
              }
              event={event}
              eventTypeReminders={
                eventTypes[event.type] ? eventTypes[event.type].reminders : []
              }
              contacts={contacts}
              reminders={reminders}
              onChangePress={(newStep) => navigateBack(newStep)}
            />
          ),
        };
    }
  };

  const { component, safeArea } = getCurrentStepProps();

  /**
   * @description Animates content fade in when currentStep changes
   * @author Ahmed Suljic
   */
  useEffect(() => {
    fadeInAnimation.setValue(0);
    Animated.timing(fadeInAnimation, {
      useNativeDriver: true,
      toValue: 1,
      duration: 500,
    }).start();
  }, [currentScreen, fadeInAnimation]);

  return safeArea ? (
    <AnimatedSafeAreaView
      onLayout={onLayout}
      forceInset={{ top: "never", bottom: "always" }}
      style={{ opacity: fadeInAnimation }}
    >
      {component}
    </AnimatedSafeAreaView>
  ) : (
    <Animated.View onLayout={onLayout} style={{ opacity: fadeInAnimation }}>
      {component}
    </Animated.View>
  );
}

const mapStateToProps = (state) => ({
  contacts: getContactList(state),
  todos: getTodoList(state),
  messageTemplates: state.referential.messageTemplates,
  eventTypes: state.referential.eventTypes,
});

const mapDispatchToProps = {
  createEvent: createEventAction,
  updateEvent: updateEventAction,
  createTodo: createTodoAction,
  updateTodo: updateTodoAction,
  deleteTodo: deleteTodoAction,
  updateRepeatingEventAndTodos: updateRepeatingEventAndTodosAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventFlow);

EventFlow.propTypes = {
  todos: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  contacts: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onLayout: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  updateRepeatingEventAndTodos: PropTypes.func.isRequired,
  createTodo: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  messageTemplates: PropTypes.object.isRequired,
  eventTypes: PropTypes.object.isRequired,
  preselectedContact: PropTypes.array,
  preselectedEventType: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  changeCalendarCurrentDate: PropTypes.func,
  disableBackPressFromAddMessage: PropTypes.bool,
};
