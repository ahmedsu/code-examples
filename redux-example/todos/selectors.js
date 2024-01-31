import { createSelector } from 'reselect';
import moment from 'moment';

import { removeKeys } from '../../utils/helperFunctions';

const getTodos = (state) => state.todos;
const getEvents = (state) => state.events;
const getSelectedEvent = (_, ownProps) => ownProps.selectedEvent;
const getContacts = (state) => state.contacts;

/**
 * @description Returns memoized todo list
 * @author Ahmed Suljic
 */
export const getTodoList = createSelector([getTodos], (todos) => {
  return Object.values(todos);
});

/**
 * @description Returns memoized todos with full event and contact information
 * @author Ahmed Suljic
 */
export const getTodosWithEventsAndContacts = createSelector(
  [getTodos, getEvents, getContacts],
  (todos, events, contacts) => {
    return Object.values(todos).map((item) => {
      return {
        ...item,
        event: events[item.content.eventId],
        contacts: events[item.content.eventId]
          ? events[item.content.eventId].contacts.map((recordId) => ({
              ...contacts[recordId],
            }))
          : [{}],
      };
    });
  },
);

/**
 * @description Returns memoized selected event todos or if it is a repeating event - event instance todos.
 * @author Ahmed Suljic
 */
export const getEventTodos = createSelector(
  [getTodos, getSelectedEvent],
  (todos, selectedEvent) => {
    const eventTodos = selectedEvent
      ? Object.values(todos).filter((item) => item.content.eventId === selectedEvent.id)
      : [];

    // If it is a repeating event get todos for each event instance
    if (selectedEvent && selectedEvent.repeatMode !== 'none') {
      // Group all event todos by their template
      const eventTodosGroupedByTemplate = eventTodos.reduce((acc, curr) => {
        return acc[curr.content.template]
          ? { ...acc, [curr.content.template]: [...acc[curr.content.template], curr] }
          : { ...acc, [curr.content.template]: [curr] };
      }, {});

      // For each todo template, get the todo that was scheduled exactly for this event
      // Or otherwise the most recent one
      const eventInstanceTodos = Object.entries(eventTodosGroupedByTemplate)
        .map(([key, value]) => {
          const eventTodo = value.find(
            (item) => item.content.eventDate === selectedEvent.scheduledDate,
          );
          if (eventTodo) {
            return eventTodo;
          } else {
            return value.reduce(
              (acc, curr) =>
                acc.eventDate > curr.content.eventDate
                  ? removeKeys(acc, ['id'])
                  : removeKeys(curr, ['id']),
              {},
            );
          }
        })
        .flat();

      // Adjust the scheduledDate of the todos (always needs to be relative to the selected event date)
      return eventInstanceTodos.map((item) => ({
        ...item,
        eventDate: selectedEvent.scheduledDate,
        scheduledDate: +moment(selectedEvent.scheduledDate).add(
          item.scheduledDate - item.eventDate,
        ),
      }));
    }
    return eventTodos;
  },
);

/**
 * @description Returns repeating event's future todos and any future event instance todos
 * that have already been scheduled in the database and have scheduled date in the future.
 * This is needed when editing a repeating event.
 * @author Ahmed Suljic
 */
export const getRepeatingEventFutureDBTodos = createSelector(
  [getTodos, getSelectedEvent],
  (todos, selectedEvent) => {
    return selectedEvent
      ? Object.values(todos).filter(
          (item) =>
            item.content.eventId === selectedEvent.id && item.content.scheduledDate >= +moment(),
        )
      : [];
  },
);
