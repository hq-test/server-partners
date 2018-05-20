export const RESET_ERROR = 'auction/RESET_ERROR';
export const RESET_SUCCESS = 'auction/RESET_SUCCESS';

export const READ_LIVE_REQUESTED = 'auction/READ_LIVE_REQUESTED';
export const READ_LIVE_SUCCESS = 'auction/READ_LIVE_SUCCESS';
export const READ_LIVE_FAILED = 'auction/READ_LIVE_FAILED';

export const READ_ARCHIVED_REQUESTED = 'auction/READ_ARCHIVED_REQUESTED';
export const READ_ARCHIVED_SUCCESS = 'auction/READ_ARCHIVED_SUCCESS';
export const READ_ARCHIVED_FAILED = 'auction/READ_ARCHIVED_FAILED';

export const SUBSCRIBE_REQUESTED = 'auction/SUBSCRIBE_REQUESTED';
export const SUBSCRIBE_SUCCESS = 'auction/SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILED = 'auction/SUBSCRIBE_FAILED';

export const UNSUBSCRIBE_REQUESTED = 'auction/UNSUBSCRIBE_REQUESTED';
export const UNSUBSCRIBE_SUCCESS = 'auction/UNSUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_FAILED = 'auction/UNSUBSCRIBE_FAILED';

export const CLIENT_UPDATE_CREATE_SUCCESS =
  'auction/CLIENT_UPDATE_CREATE_SUCCESS';
export const CLIENT_UPDATE_UPDATE_SUCCESS =
  'auction/CLIENT_UPDATE_UPDATE_SUCCESS';
export const CLIENT_UPDATE_DESTROY_SUCCESS =
  'auction/CLIENT_UPDATE_DESTROY_SUCCESS';

const initialState = {
  liveList: [],
  archivedList: [],
  isReading: false,
  error: null,
  success: null,
  isSubscribing: false,
  isUnSubscribing: false,
  isSubscribed: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_SUCCESS:
      return {
        ...state,
        success: null
      };

    case READ_LIVE_REQUESTED:
      return {
        ...state,
        isReading: true,
        error: null,
        success: null
      };

    case READ_LIVE_SUCCESS:
      return {
        ...state,
        liveList: action.data,
        isReading: !state.isReading,
        error: null,
        success: null
      };

    case READ_LIVE_FAILED:
      return {
        ...state,
        isReading: !state.isReading,
        error: action.error,
        success: null
      };

    case READ_ARCHIVED_REQUESTED:
      return {
        ...state,
        isReading: true,
        error: null,
        success: null
      };

    case READ_ARCHIVED_SUCCESS:
      return {
        ...state,
        archivedList: action.data,
        isReading: !state.isReading,
        error: null,
        success: null
      };

    case READ_ARCHIVED_FAILED:
      return {
        ...state,
        isReading: !state.isReading,
        error: action.error,
        success: null
      };

    case SUBSCRIBE_REQUESTED:
      return {
        ...state,
        isSubscribing: true,
        error: null,
        success: null
      };

    case SUBSCRIBE_SUCCESS:
      return {
        ...state,
        isSubscribing: false,
        isSubscribed: true
      };

    case SUBSCRIBE_FAILED:
      return {
        ...state,
        isSubscribing: false,
        isSubscribed: false
      };

    case UNSUBSCRIBE_REQUESTED:
      return {
        ...state,
        isUnSubscribing: true,
        error: null,
        success: null
      };

    case UNSUBSCRIBE_SUCCESS:
      return {
        ...state,
        isUnSubscribing: false,
        isSubscribed: false
      };

    case UNSUBSCRIBE_FAILED:
      return {
        ...state,
        isUnSubscribing: false
      };

    case CLIENT_UPDATE_CREATE_SUCCESS:
      return {
        ...state,
        liveList:
          action.data.isRunning && action.data.isActive
            ? [...state.liveList, action.data]
            : state.liveList,
        error: null,
        success: null
      };

    case CLIENT_UPDATE_UPDATE_SUCCESS:
      let liveList = state.liveList.filter(item => item.id !== action.id);
      let archivedList = state.archivedList.filter(
        item => item.id !== action.id
      );
      liveList =
        action.data.isRunning && action.data.isActive
          ? [...liveList, action.data]
          : liveList;

      archivedList =
        !action.data.isRunning && action.data.isActive && action.data.endAt > 0
          ? [action.data, ...archivedList]
          : archivedList;
      return {
        ...state,
        liveList: liveList,
        archivedList: archivedList,
        error: null,
        success: null
      };

    case CLIENT_UPDATE_DESTROY_SUCCESS:
      return {
        ...state,
        liveList: state.liveList.filter(item => item.id !== action.id),
        archivedList: state.archivedList.filter(item => item.id !== action.id),
        error: null,
        success: null
      };
    default:
      return state;
  }
};

export const ReadLive = () => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_REQUESTED
    });
    console.log('reading live list of auctions');

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/auction/read/live',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: READ_LIVE_FAILED,
            error: response.error
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: READ_LIVE_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

export const ReadArchived = () => {
  return dispatch => {
    dispatch({
      type: READ_ARCHIVED_REQUESTED
    });
    console.log('reading archived list of auctions');

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/auction/read/archived',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: READ_ARCHIVED_FAILED
          });
          return;
        }
        dispatch({
          type: READ_ARCHIVED_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

export const Subscribe = () => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });
    console.log('subscribing to list of auctions');

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/subscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: SUBSCRIBE_FAILED
          });
          return;
        }
        dispatch({
          type: SUBSCRIBE_SUCCESS
        });
      }
    );
  };
};

export const UnSubscribe = () => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });
    console.log('subscribing to list of auctions');

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/unsubscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: UNSUBSCRIBE_FAILED,
            error: response.error
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: UNSUBSCRIBE_SUCCESS
        });
      }
    );
  };
};

export const HandleClientCreate = data => {
  console.log('HandleClientCreate', data);
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_CREATE_SUCCESS,
      data: data
    });
  };
};

export const HandleClientUpdate = data => {
  console.log('HandleClientUpdate', data);

  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_UPDATE_SUCCESS,
      data: data
    });
  };
};

export const HandleClientDestroy = id => {
  console.log('HandleClientDestroy', id);

  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_DESTROY_SUCCESS,
      id: id
    });
  };
};
