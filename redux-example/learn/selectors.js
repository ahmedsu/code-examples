import { createSelector } from 'reselect';

const getStories = (state) => state.stories;

const getStoryList = createSelector([getStories], (stories) => Object.values(stories));

export default getStoryList;
