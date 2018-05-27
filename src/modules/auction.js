/***************************************************************************
 *                                                                          *
 * Auction Module                                                           *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Load Libraries                                                           *
 *                                                                          *
 ***************************************************************************/
var _ = require('lodash');

/***************************************************************************
 *                                                                          *
 * Actions                                                                  *
 *                                                                          *
 ***************************************************************************/
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

/***************************************************************************
 *                                                                          *
 * Initial State                                                            *
 *                                                                          *
 ***************************************************************************/
const initialState = {
  liveList: [], // list of live auctions
  archivedList: [], // list of archived auctions
  isReading: false, // is in reading process and filling auction list
  error: null, // error message of action creators
  success: null, // success message of action creators
  isSubscribing: false, // is in subscribe process
  isUnSubscribing: false, // is in unsubscibe process
  isSubscribed: false // does it currently subscibed to auction room
};

/***************************************************************************
 *                                                                          *
 * Reducers                                                                 *
 *                                                                          *
 ***************************************************************************/
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

        // reorder live list of auctions by duration
        liveList:
          action.data.isRunning && action.data.isActive
            ? _.orderBy([...state.liveList, action.data], 'endAt', 'DESC')
            : state.liveList,

        error: null,
        success: null
      };

    case CLIENT_UPDATE_UPDATE_SUCCESS:
      // remove updated auction from live list
      let liveList = state.liveList.filter(item => item.id !== action.data.id);

      // remove updated auction from archived list
      let archivedList = state.archivedList.filter(
        item => item.id !== action.data.id
      );

      // check to see if necessary to add it in LIVE list
      liveList =
        action.data.isRunning && action.data.isActive
          ? [...liveList, action.data]
          : liveList;

      // check to see if necessary to add it in ARCHIVED list
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

        // remove auction from LIVE list and reorder the list
        liveList: _.orderBy(
          state.liveList.filter(item => item.id !== action.id),
          'endAt',
          'DESC'
        ),

        // remove auction from ARCHIVED list and reorder the list
        archivedList: _.orderBy(
          state.archivedList.filter(item => item.id !== action.id),
          'endAt',
          'DESC'
        ),
        error: null,
        success: null
      };
    default:
      return state;
  }
};

/***************************************************************************
 *                                                                          *
 * Action Creators                                                          *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Read LIVE auction list                                                   *
 *                                                                          *
 ***************************************************************************/
export const ReadLive = () => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/auction/read/live',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: READ_LIVE_FAILED,
            error: response.error && response.error.message
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

/***************************************************************************
 *                                                                          *
 * Read archived auction list                                               *
 *                                                                          *
 ***************************************************************************/
export const ReadArchived = () => {
  return dispatch => {
    dispatch({
      type: READ_ARCHIVED_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/auction/read/archived',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
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

/***************************************************************************
 *                                                                          *
 * Subscribe to auction model room                                          *
 *                                                                          *
 ***************************************************************************/
export const Subscribe = () => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/subscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
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

/***************************************************************************
 *                                                                          *
 * Unsubscribe to auction model room                                        *
 *                                                                          *
 ***************************************************************************/
export const UnSubscribe = () => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/unsubscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: UNSUBSCRIBE_FAILED,
            error: response.error && response.error.message
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

/***************************************************************************
 *                                                                          *
 * Update auction list when a create message receive                        *
 *                                                                          *
 ***************************************************************************/
export const HandleClientCreate = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_CREATE_SUCCESS,
      data: data
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Update auction list when an update message receive                       *
 *                                                                          *
 ***************************************************************************/
export const HandleClientUpdate = (data, partnerId) => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_UPDATE_SUCCESS,
      data
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Update auction list when a remove message receive                        *
 *                                                                          *
 ***************************************************************************/
export const HandleClientDestroy = id => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_DESTROY_SUCCESS,
      id: id
    });
  };
};
