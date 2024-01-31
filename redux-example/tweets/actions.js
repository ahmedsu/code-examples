export const SET_TWEETS_LIST = 'SET_TWEETS_LIST';

export const setTweetsList = (tweets) => ({
  type: SET_TWEETS_LIST,
  payload: tweets,
});
