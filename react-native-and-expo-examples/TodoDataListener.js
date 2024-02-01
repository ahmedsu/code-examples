import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firestore from "@react-native-firebase/firestore";

import { loadTodosSuccess as loadTodosSuccessAction } from "../../redux/todos/actions";
import { setLoadingList } from "../../redux/app/actions";
import {
  formatArrayToObject,
  snapshotToArray,
} from "../../utils/helperFunctions";
import { todosTypes } from "../../utils/constants";
import bugsnag from "../../utils/bugsnag";

/**
 * @description Component for listening to real time data changes in firestore todos data table
 * and updating the necessary data in redux
 * @author Ahmed Suljic
 */
function TodoDataListener(props) {
  const { userId, loadTodosSuccess } = props;
  /**
   * @description Handler for real time data changes in todos collection in database for a selected user
   * @author Ahmed Suljic
   */
  const onResult = useCallback(
    (documentSnapshot) => {
      setLoadingList({ loadingList: true, loadingListType: "todo" });
      const data = snapshotToArray(documentSnapshot);
      loadTodosSuccess({
        todos: formatArrayToObject(data),
      });
      setLoadingList({ loadingList: false, loadingListType: "todo" });
    },
    [loadTodosSuccess]
  );
  /**
   * @description Error handler for firebase onSnapshot method
   * @author Ahmed Suljic
   */
  const onError = (error) =>
    bugsnag.notify("Error in firestore todo data collection snapshot", error);

  /**
   * @description Subscribe to real time data changes in todo data collection for the current user
   * @author Ahmed Suljic
   */
  useEffect(() => {
    if (userId) {
      const subscribe = firestore()
        .collection("todos")
        .where("content.userId", "==", userId)
        .where("type", "==", todosTypes.eventTodos)
        .onSnapshot(onResult, onError);

      return () => subscribe();
    }
  }, [onResult, userId]);

  return null;
}

const mapStateToProps = (state) => ({
  userId: state.user.id,
});

const mapDispatchToProps = {
  loadTodosSuccess: loadTodosSuccessAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoDataListener);

TodoDataListener.propTypes = {
  userId: PropTypes.string,
  loadTodosSuccess: PropTypes.func.isRequired,
};
