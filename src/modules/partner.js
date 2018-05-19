export const RESET_ERROR = 'partner/RESET_ERROR';
export const RESET_SUCCESS = 'partner/RESET_SUCCESS';

export const CREATE_REQUESTED = 'partner/CREATE_REQUESTED';
export const CREATE_SUCCESS = 'partner/CREATE_SUCCESS';
export const CREATE_FAILED = 'partner/CREATE_FAILED';

export const DELETE_REQUESTED = 'partner/DELETE_REQUESTED';
export const DELETE_SUCCESS = 'partner/DELETE_SUCCESS';
export const DELETE_FAILED = 'partner/DELETE_FAILED';

export const READ_REQUESTED = 'partner/READ_REQUESTED';
export const READ_SUCCESS = 'partner/READ_SUCCESS';
export const READ_FAILED = 'partner/READ_FAILED';

export const LOGIN_REQUESTED = 'partner/LOGIN_REQUESTED';
export const LOGIN_SUCCESS = 'partner/LOGIN_SUCCESS';
export const LOGIN_FAILED = 'partner/LOGIN_FAILED';

export const LOGOUT_REQUESTED = 'partner/LOGOUT_REQUESTED';
export const LOGOUT_SUCCESS = 'partner/LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'partner/LOGOUT_FAILED';

const initialState = {
  list: [],
  isCreating: false,
  isDeleting: false,
  isReading: false,
  error: null,
  success: null,
  isLoggedIn: false,
  isLogining: false,
  loggedInUser: null
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

    case READ_REQUESTED:
      return {
        ...state,
        isReading: true,
        error: null,
        success: null
      };

    case READ_SUCCESS:
      return {
        ...state,
        list: action.data,
        isReading: !state.isReading,
        error: null,
        success: null
      };

    case READ_FAILED:
      return {
        ...state,
        isReading: !state.isReading,
        error: action.error,
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
        list: [action.data, ...state.list],
        isCreating: !state.isCreating,
        error: null,
        success: 'created successfully'
      };

    case CREATE_FAILED:
      return {
        ...state,
        isCreating: !state.isCreating,
        error: action.error,
        success: null
      };

    case DELETE_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        error: null,
        success: null
      };

    case DELETE_SUCCESS:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.id),
        isDeleting: !state.isDeleting,
        error: null,
        success: 'delete successfully'
      };

    case DELETE_FAILED:
      return {
        ...state,
        isDeleting: !state.isDeleting,
        error: action.error,
        success: null
      };

    case LOGIN_REQUESTED:
      return {
        ...state,
        loggedInUser: null,
        isLogining: true,
        isLoggedIn: false,
        error: null,
        success: null
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedInUser: action.data,
        isLogining: false,
        isLoggedIn: true,
        error: null,
        success: 'login successfully'
      };

    case LOGIN_FAILED:
      return {
        ...state,
        loggedInUser: null,
        isLogining: false,
        isLoggedIn: false,
        error: action.error,
        success: null
      };

    case LOGOUT_REQUESTED:
      return {
        ...state,
        error: null,
        success: null
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggedInUser: null,
        isLoggedIn: false,
        error: null
        //success: 'logout successfully'
      };

    case LOGOUT_FAILED:
      return {
        ...state,
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
    console.log('create new partner with data', data);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/partner',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
          dispatch({
            type: CREATE_FAILED,
            error: jwres.error.message
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
          data: response
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

export const Delete = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });
    console.log('delete partner with id', id);

    window.IO.socket.request(
      {
        method: 'delete',
        url: 'http://127.0.0.1:1337/partner/' + id,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
          dispatch({
            type: DELETE_FAILED,
            error: jwres.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: DELETE_SUCCESS,
          id
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

export const Read = () => {
  return dispatch => {
    dispatch({
      type: READ_REQUESTED
    });
    console.log('reading list of partners');

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/partner',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
          dispatch({
            type: READ_FAILED,
            error: jwres.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: READ_SUCCESS,
          data: response
        });
      }
    );
  };
};

export const Login = data => {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/partner/login',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: LOGIN_FAILED,
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
          type: LOGIN_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

export const Logout = () => {
  return dispatch => {
    dispatch({
      type: LOGOUT_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/partner/logout',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: LOGOUT_FAILED,
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
          type: LOGOUT_SUCCESS
        });
      }
    );
  };
};
