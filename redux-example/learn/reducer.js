import {
  FETCH_STORIES_SUCCESS,
  FETCH_COURSES_SUCCESS,
  FETCH_COMPLETED_COURSES_SUCCESS,
} from './actions';

const initialState = {};

export default function learnReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case FETCH_STORIES_SUCCESS: {
      // Check if the story has the necessary tags meaning that it belongs in the app
      const filteredStories = payload.stories.filter(
        (story) => story.tags.includes(460) || story.categories.includes(461),
      );
      return {
        ...state,
        stories: filteredStories,
      };
    }
    case FETCH_COURSES_SUCCESS:
      return {
        ...state,
        courses: payload.courses,
      };
    case FETCH_COMPLETED_COURSES_SUCCESS:
      return {
        ...state,
        completedCourses: payload.completedCourses,
      };
    default:
      return state;
  }
}
