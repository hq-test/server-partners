/***************************************************************************
 *                                                                          *
 * Bid Module                                                               *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Actions                                                                  *
 *                                                                          *
 ***************************************************************************/
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

/***************************************************************************
 *                                                                          *
 * Initial State                                                            *
 *                                                                          *
 ***************************************************************************/
const initialState = {
  bidList: [], // list of bids for an auction
  totalBids: 0, // total bids of an auction
  maxId: null, // pointer to a bid id for pagination query ( I use twitter real-time pagination method )
  isReading: false, // is in reading process and filling bid list
  isCreating: false, // is in creating process
  error: null, // error message store here
  success: null, // success message store here
  isSubscribing: false, // is in subscribe process
  isUnSubscribing: false, // is in unsubscibe process
  isSubscribed: false, // does it currently subscibed to bid of auction
  searchError: null, // error message of search
  searchSuccess: null, // success message of search
  isSearching: false, // is in search process
  searchItem: null // auction item we find by bid ID
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

        // add new bid in top of bid list
        bidList: [action.data, ...state.bidList],

        // update total bid for this auction
        totalBids: state.totalBids + 1,

        error: null,
        success: null
      };

    case CLIENT_UPDATE_UPDATE_SUCCESS:
      return {
        ...state,

        // find old auction and replace with new updated auction
        bidList: state.bidList.map(
          item => (item.id !== action.data.id ? item : action.data)
        ),

        error: null,
        success: null
      };

    case READ_LIVE_RESET:
      return {
        ...state,

        // remove list of bids
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

        // set pointer to last item of bids in the list
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

        // add new loaded bids to end of bid lists
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

/***************************************************************************
 *                                                                          *
 * Action Creators                                                          *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * create new bid                                                           *
 *                                                                          *
 ***************************************************************************/
export const Create = data => {
  return dispatch => {
    dispatch({
      type: CREATE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/bid/create',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
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

/***************************************************************************
 *                                                                          *
 * Search by bid ID                                                         *
 *                                                                          *
 ***************************************************************************/
export const Search = bidId => {
  return dispatch => {
    dispatch({
      type: SEARCH_REQUESTED
    });

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

/***************************************************************************
 *                                                                          *
 * Reset search result                                                      *
 *                                                                          *
 ***************************************************************************/
export const ResetSearch = () => {
  return dispatch => {
    dispatch({
      type: SEARCH_RESET
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Reset live list of bids                                                  *
 *                                                                          *
 ***************************************************************************/
export const ResetLiveList = () => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_RESET
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Read live list of bids                                                   *
 *                                                                          *
 ***************************************************************************/
export const ReadLive = auctionId => {
  return dispatch => {
    dispatch({
      type: READ_LIVE_REQUESTED
    });

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
 * Read more bids of an auction with pagination support                     *
 *                                                                          *
 ***************************************************************************/
export const ReadMore = (auctionId, maxId) => {
  return dispatch => {
    dispatch({
      type: READ_MORE_REQUESTED
    });

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

/***************************************************************************
 *                                                                          *
 * subscribe to an auction for listening to bids                            *
 *                                                                          *
 ***************************************************************************/
export const Subscribe = auctionId => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });

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
 * unsubscribe to an auction                                                *
 *                                                                          *
 ***************************************************************************/
export const UnSubscribe = auctionId => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });

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
 * Update bid list when a create message receive                            *
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
 * Update bid list when an update message receive                           *
 *                                                                          *
 ***************************************************************************/
export const HandleClientUpdate = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_UPDATE_SUCCESS,
      data: data
    });
  };
};
