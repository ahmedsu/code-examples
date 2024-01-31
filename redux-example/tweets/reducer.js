import { SET_TWEETS_LIST } from './actions';

const initialState = {
  tweetsList: [],
};

export default function tweetsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_TWEETS_LIST:
      return {
        ...state,
        tweetsList: payload,
      };
    default:
      return state;
  }
}
