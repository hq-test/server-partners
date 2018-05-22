// var _ = require('lodash');

export const RESET_ERROR = 'bid/RESET_ERROR';
export const RESET_SUCCESS = 'bid/RESET_SUCCESS';

export const CREATE_REQUESTED = 'bid/CREATE_REQUESTED';
export const CREATE_SUCCESS = 'bid/CREATE_SUCCESS';
export const CREATE_FAILED = 'bid/CREATE_FAILED';

// export const DELETE_REQUESTED = 'bid/DELETE_REQUESTED';
// export const DELETE_SUCCESS = 'bid/DELETE_SUCCESS';
// export const DELETE_FAILED = 'bid/DELETE_FAILED';
//
// export const READ_REQUESTED = 'bid/READ_REQUESTED';
// export const READ_SUCCESS = 'bid/READ_SUCCESS';
// export const READ_FAILED = 'bid/READ_FAILED';
//
// export const START_REQUESTED = 'bid/START_REQUESTED';
// export const START_SUCCESS = 'bid/START_SUCCESS';
// export const START_FAILED = 'bid/START_FAILED';
//
// export const SUBSCRIBE_REQUESTED = 'bid/SUBSCRIBE_REQUESTED';
// export const SUBSCRIBE_SUCCESS = 'bid/SUBSCRIBE_SUCCESS';
// export const SUBSCRIBE_FAILED = 'bid/SUBSCRIBE_FAILED';
//
// export const UNSUBSCRIBE_REQUESTED = 'bid/UNSUBSCRIBE_REQUESTED';
// export const UNSUBSCRIBE_SUCCESS = 'bid/UNSUBSCRIBE_SUCCESS';
// export const UNSUBSCRIBE_FAILED = 'bid/UNSUBSCRIBE_FAILED';

// export const CLIENT_UPDATE_CREATE_SUCCESS = 'bid/CLIENT_UPDATE_CREATE_SUCCESS';
// export const CLIENT_UPDATE_UPDATE_SUCCESS = 'bid/CLIENT_UPDATE_UPDATE_SUCCESS';
// export const CLIENT_UPDATE_DESTROY_SUCCESS =
//   'bid/CLIENT_UPDATE_DESTROY_SUCCESS';

const initialState = {
  list: [],
  isCreating: false,
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
    //
    // case DELETE_REQUESTED:
    //   return {
    //     ...state,
    //     isDeleting: true,
    //     error: null,
    //     success: null
    //   };
    //
    // case DELETE_SUCCESS:
    //   return {
    //     ...state,
    //     list: state.list.filter(item => item.id !== action.id),
    //     isDeleting: !state.isDeleting,
    //     error: null,
    //     success: 'delete successfully'
    //   };
    //
    // case DELETE_FAILED:
    //   return {
    //     ...state,
    //     isDeleting: !state.isDeleting,
    //     error: action.error,
    //     success: null
    //   };
    //
    // case START_REQUESTED:
    //   return {
    //     ...state,
    //     isStarting: true,
    //     error: null,
    //     success: null
    //   };
    //
    // case START_SUCCESS:
    //   console.log('new start', action.data);
    //   return {
    //     ...state,
    //     isStarting: !state.isStarting,
    //     error: null,
    //     success: 'live auction successfully'
    //   };
    //
    // case START_FAILED:
    //   return {
    //     ...state,
    //     isStarting: !state.isStarting,
    //     error: action.error,
    //     success: null
    //   };
    //
    // case SUBSCRIBE_REQUESTED:
    //   return {
    //     ...state,
    //     isSubscribing: true,
    //     error: null,
    //     success: null
    //   };
    //
    // case SUBSCRIBE_SUCCESS:
    //   return {
    //     ...state,
    //     isSubscribing: false,
    //     isSubscribed: true
    //   };
    //
    // case SUBSCRIBE_FAILED:
    //   return {
    //     ...state,
    //     isSubscribing: false,
    //     isSubscribed: false
    //   };
    //
    // case UNSUBSCRIBE_REQUESTED:
    //   return {
    //     ...state,
    //     isUnSubscribing: true,
    //     error: null,
    //     success: null
    //   };
    //
    // case UNSUBSCRIBE_SUCCESS:
    //   return {
    //     ...state,
    //     isUnSubscribing: false,
    //     isSubscribed: false
    //   };
    //
    // case UNSUBSCRIBE_FAILED:
    //   return {
    //     ...state,
    //     isUnSubscribing: false
    //   };
    //
    // case CLIENT_UPDATE_CREATE_SUCCESS:
    //   return {
    //     ...state,
    //     list: _.orderBy([action.data, ...state.list], 'endAt', 'DESC'),
    //     error: null,
    //     success: null
    //   };
    //
    // case CLIENT_UPDATE_UPDATE_SUCCESS:
    //   return {
    //     ...state,
    //     list: _.orderBy(
    //       state.list.map(
    //         item => (item.id !== action.data.id ? item : action.data)
    //       ),
    //       'endAt',
    //       'DESC'
    //     ),
    //     error: null,
    //     success: null
    //   };
    //
    // case CLIENT_UPDATE_DESTROY_SUCCESS:
    //   return {
    //     ...state,
    //     list: state.list.filter(item => item.id !== action.id),
    //     error: null,
    //     success: null
    //   };

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
//
// export const Delete = id => {
//   return dispatch => {
//     dispatch({
//       type: DELETE_REQUESTED
//     });
//     console.log('delete auction with id', id);
//
//     window.IO.socket.request(
//       {
//         method: 'delete',
//         url: 'http://127.0.0.1:1337/api/auction/destroy',
//         data: {
//           id
//         },
//         headers: {}
//       },
//       function(response, jwres) {
//         if (!response.result) {
//           console.log(response); // => e.g. 403
//           dispatch({
//             type: DELETE_FAILED,
//             error: response.error && response.error.message
//           });
//           setTimeout(() => {
//             dispatch({
//               type: RESET_ERROR
//             });
//           }, 3000);
//           return;
//         }
//         dispatch({
//           type: DELETE_SUCCESS,
//           id
//         });
//         setTimeout(() => {
//           dispatch({
//             type: RESET_SUCCESS
//           });
//         }, 3000);
//       }
//     );
//   };
// };
//
// export const Read = () => {
//   return dispatch => {
//     dispatch({
//       type: READ_REQUESTED
//     });
//     console.log('reading list of auctions');
//
//     window.IO.socket.request(
//       {
//         method: 'get',
//         url: 'http://127.0.0.1:1337/api/auction/read/all',
//         //data: data,
//         headers: {}
//       },
//       function(response, jwres) {
//         if (!response.result) {
//           console.log(response); // => e.g. 403
//           dispatch({
//             type: READ_FAILED,
//             error: response.error && response.error.message
//           });
//           setTimeout(() => {
//             dispatch({
//               type: RESET_ERROR
//             });
//           }, 3000);
//           return;
//         }
//         dispatch({
//           type: READ_SUCCESS,
//           data: response.data
//         });
//       }
//     );
//   };
// };
//
// export const Start = id => {
//   return dispatch => {
//     dispatch({
//       type: DELETE_REQUESTED
//     });
//     console.log('start auction with id', id);
//
//     window.IO.socket.request(
//       {
//         method: 'put',
//         url: 'http://127.0.0.1:1337/api/auction/start',
//         data: {
//           id
//         },
//         headers: {}
//       },
//       function(response, jwres) {
//         if (!response.result) {
//           console.log(response); // => e.g. 403
//           dispatch({
//             type: START_FAILED,
//             error: response.error && response.error.message
//           });
//           setTimeout(() => {
//             dispatch({
//               type: RESET_ERROR
//             });
//           }, 3000);
//           return;
//         }
//         dispatch({
//           type: START_SUCCESS,
//           data: response.data
//         });
//         setTimeout(() => {
//           dispatch({
//             type: RESET_SUCCESS
//           });
//         }, 3000);
//       }
//     );
//   };
// };
//
// export const Subscribe = () => {
//   return dispatch => {
//     dispatch({
//       type: SUBSCRIBE_REQUESTED
//     });
//     console.log('subscribing to list of auctions');
//
//     window.IO.socket.request(
//       {
//         method: 'post',
//         url: 'http://127.0.0.1:1337/api/auction/subscribe',
//         headers: {}
//       },
//       function(response, jwres) {
//         if (!response.result) {
//           console.log(response); // => e.g. 403
//           dispatch({
//             type: SUBSCRIBE_FAILED
//           });
//           return;
//         }
//         dispatch({
//           type: SUBSCRIBE_SUCCESS
//         });
//       }
//     );
//   };
// };
//
// export const UnSubscribe = () => {
//   return dispatch => {
//     dispatch({
//       type: UNSUBSCRIBE_REQUESTED
//     });
//     console.log('subscribing to list of auctions');
//
//     window.IO.socket.request(
//       {
//         method: 'post',
//         url: 'http://127.0.0.1:1337/api/auction/unsubscribe',
//         headers: {}
//       },
//       function(response, jwres) {
//         if (!response.result) {
//           console.log(response); // => e.g. 403
//           dispatch({
//             type: UNSUBSCRIBE_FAILED,
//             error: response.error
//           });
//           setTimeout(() => {
//             dispatch({
//               type: RESET_ERROR
//             });
//           }, 3000);
//           return;
//         }
//         dispatch({
//           type: UNSUBSCRIBE_SUCCESS
//         });
//       }
//     );
//   };
// };
//
// export const HandleClientCreate = data => {
//   console.log('HandleClientCreate', data);
//   return dispatch => {
//     dispatch({
//       type: CLIENT_UPDATE_CREATE_SUCCESS,
//       data: data
//     });
//   };
// };
//
// export const HandleClientUpdate = data => {
//   console.log('HandleClientUpdate', data);
//
//   return dispatch => {
//     dispatch({
//       type: CLIENT_UPDATE_UPDATE_SUCCESS,
//       data: data
//     });
//   };
// };
//
// export const HandleClientDestroy = id => {
//   console.log('HandleClientDestroy', id);
//
//   return dispatch => {
//     dispatch({
//       type: CLIENT_UPDATE_DESTROY_SUCCESS,
//       id: id
//     });
//   };
// };
