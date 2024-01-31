export const FETCH_STORIES = 'FETCH_STORIES';
export const FETCH_STORIES_SUCCESS = 'FETCH_STORIES_SUCCESS';
export const FETCH_COURSES = 'FETCH_COURSES';
export const FETCH_COURSES_SUCCESS = 'FETCH_COURSES_SUCCESS';
export const FETCH_COMPLETED_COURSES = 'FETCH_COMPLETED_COURSES';
export const FETCH_COMPLETED_COURSES_SUCCESS = 'FETCH_COMPLETED_COURSES_SUCCESS';

export const fetchStories = () => ({
  type: FETCH_STORIES,
});

export const fetchCourses = () => ({
  type: FETCH_COURSES,
});

export const fetchCompletedCourses = () => ({
  type: FETCH_COMPLETED_COURSES,
});

export const fetchStoriesSuccess = ({ stories }) => ({
  type: FETCH_STORIES_SUCCESS,
  payload: {
    stories,
  },
});

export const fetchCoursesSuccess = ({ courses }) => ({
  type: FETCH_COURSES_SUCCESS,
  payload: {
    courses,
  },
});

export const fetchCompletedCoursesSuccess = ({ completedCourses }) => ({
  type: FETCH_COMPLETED_COURSES_SUCCESS,
  payload: {
    completedCourses,
  },
});
