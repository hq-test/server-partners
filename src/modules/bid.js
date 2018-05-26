// var _ = require('lodash');

export const RESET_ERROR = 'bid/RESET_ERROR';
export const RESET_SUCCESS = 'bid/RESET_SUCCESS';

export const RESET_ERROR_SEARCH = 'bid/RESET_ERROR_SEARCH';
export const RESET_SUCCESS_SEARCH = 'bid/RESET_SUCCESS_SEARCH';

export const CREATE_REQUESTED = 'bid/CREATE_REQUESTED';
export const CREATE_SUCCESS = 'bid/CREATE_SUCCESS';
export const CREATE_FAILED = 'bid/CREATE_FAILED';

export const SEARCH_RESET = 'bid/SEARCH_RESET';
export const SEARCH_REQUESTED = 'bid/SEARCH_REQUESTED';
export const SEARCH_SUCCESS = 'bid/SEARCH_SUCCESS';
export const SEARCH_FAILED = 'bid/SEARCH_FAILED';

export const SUBSCRIBE_REQUESTED = 'bid/SUBSCRIBE_REQUESTED';
export const SUBSCRIBE_SUCCESS = 'bid/SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILED = 'bid/SUBSCRIBE_FAILED';

export const UNSUBSCRIBE_REQUESTED = 'bid/UNSUBSCRIBE_REQUESTED';
export const UNSUBSCRIBE_SUCCESS = 'bid/UNSUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_FAILED = 'bid/UNSUBSCRIBE_FAILED';

export const CLIENT_UPDATE_CREATE_SUCCESS = 'bid/CLIENT_UPDATE_CREATE_SUCCESS';
export const CLIENT_UPDATE_UPDATE_SUCCESS = 'bid/CLIENT_UPDATE_UPDATE_SUCCESS';

export const READ_LIVE_RESET = 'bid/READ_LIVE_RESET';
export const READ_LIVE_REQUESTED = 'bid/READ_LIVE_REQUESTED';
export const READ_LIVE_SUCCESS = 'bid/READ_LIVE_SUCCESS';
export const READ_LIVE_FAILED = 'bid/READ_LIVE_FAILED';

export const READ_MORE_REQUESTED = 'bid/READ_MORE_REQUESTED';
export const READ_MORE_SUCCESS = 'bid/READ_MORE_SUCCESS';
export const READ_MORE_FAILED = 'bid/READ_MORE_FAILED';

const initialState = {
  bidList: [],
  totalBids: 0,
  maxId: null,
  list: [],
  isReading: false,
  isCreating: false,
  error: null,
  success: null,
  isSubscribing: false,
  isUnSubscribing: false,
  isSubscribed: false,
  searchError: null,
  searchSuccess: null,
  isSearching: false,
  searchItem: null
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

    case RESET_ERROR_SEARCH:
      return {
        ...state,
        searchError: null
      };

    case RESET_SUCCESS_SEARCH:
      return {
        ...state,
        searchSuccess: null
      };

    case CREATE_REQUESTED:
      return {
        ...state,
        isCreating: true,
        error: null,
        success: null
      };

    case CREATE_SUCCESS:
      return {
        ...state,
        isCreating: !state.isCreating,
        error: null,
        success: `Your bid with ID ${action.data.id} submitted successfully`
      };

    case CREATE_FAILED:
      return {
        ...state,
        isCreating: !state.isCreating,
        error: action.error,
        success: null
      };

    case SEARCH_RESET:
      return {
        ...state,
        searchError: null,
        searchSuccess: null,
        searchItem: null
      };

    case SEARCH_REQUESTED:
      return {
        ...state,
        isSearching: true,
        searchError: null,
        searchSuccess: null,
        searchItem: null
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        searchItem: action.data,
        isSearching: !state.isSearching,
        searchError: null,
        searchSuccess: `Your bid with ID ${action.data.bid.id} found`
      };

    case SEARCH_FAILED:
      return {
        ...state,
        isSearching: !state.isSearching,
        searchError: action.error,
        searchSuccess: null
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
        bidList: [action.data, ...state.bidList],
        totalBids: state.totalBids + 1,
        error: null,
        success: null
      };

    case CLIENT_UPDATE_UPDATE_SUCCESS:
      return {
        ...state,
        bidList: state.bidList.map(
          item => (item.id !== action.data.id ? item : action.data)
        ),
        error: null,
        success: null
      };

    case READ_LIVE_RESET:
      return {
        ...state,
        bidList: []
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
        bidList: action.data.bids,
        maxId:
          action.data.bids && action.data.bids.length
            ? action.data.bids[action.data.bids.length - 1].id
            : null,
        totalBids: action.data.totalBids,
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

    case READ_MORE_REQUESTED:
      return {
        ...state,
        isReading: true,
        error: null,
        success: null
      };

    case READ_MORE_SUCCESS:
      return {
        ...state,
        bidList: [...state.bidList, ...action.data],
        isReading: !state.isReading,
        maxId:
          action.data && action.data.length
            ? action.data[action.data.length - 1].id
            : null,
        error: null,
        success: null
      };

    case READ_MORE_FAILED:
      return {
        ...state,
        isReading: !state.isReading,
        error: action.error,
        success: null
      };

    default:
      return state;
  }
};

export const Create = data => {
  return dispatch => {
    dispatch({
      type: CREATE_REQUESTED
    });
    console.log('create new bid with data', data);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/bid/create',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: CREATE_FAILED,
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
          type: CREATE_SUCCESS,
          data: response.data
        });
        setTimeout(() => {
          dispatch({
            type: RESET_SUCCESS
          });
        }, 3000);
      }
    );
  };
};

export const Search = bidId => {
  return dispatch => {
    dispatch({
      type: SEARCH_REQUESTED
    });
    console.log('searching bid', bidId);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/bid/search/id',
        data: {
          id: bidId
        },
        headers: {}
      },
      function(response, jwres) {
        console.log('response', response);
        if (!response.result) {
          dispatch({
            type: SEARCH_FAILED,
            error: response.error && response.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR_SEARCH
            });
          }, 3000);
          return;
        }
        dispatch({
          type: SEARCH_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

export const ResetSearch = () => {
  return dispatch => {
    dispatch({
      type: SEARCH_RESET
    });
  };
};

export const ResetLiveList = () => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_RESET
    });
  };
};

export const ReadLive = auctionId => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_REQUESTED
    });
    console.log('reading recent list of bids for auction', auctionId);

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/bid/read/live',
        data: {
          id: auctionId
        },
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
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

export const ReadMore = (auctionId, maxId) => {
  return dispatch => {
    dispatch({
      type: READ_MORE_REQUESTED
    });
    console.log('reading recent list of bids for auction', auctionId, maxId);

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/bid/read/more',
        data: {
          id: auctionId,
          maxId
        },
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: READ_MORE_FAILED,
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
          type: READ_MORE_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

export const Subscribe = auctionId => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });
    console.log('subscribing to an auction id', auctionId);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/detail/subscribe',
        data: {
          auctionId
        },
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

export const UnSubscribe = auctionId => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });
    console.log('unsubscribing to auction id', auctionId);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/detail/unsubscribe',
        data: {
          auctionId
        },
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
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

export const HandleClientCreate = data => {
  console.log('HandleClientCreate bid ', data);
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_CREATE_SUCCESS,
      data: data
    });
  };
};

export const HandleClientUpdate = data => {
  console.log('HandleClientUpdate bid', data);

  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_UPDATE_SUCCESS,
      data: data
    });
  };
};
