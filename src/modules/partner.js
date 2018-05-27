/***************************************************************************
 *                                                                          *
 * Partner Module                                                           *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Actions                                                                  *
 *                                                                          *
 ***************************************************************************/
export const RESET_ERROR = 'partner/RESET_ERROR';
export const RESET_SUCCESS = 'partner/RESET_SUCCESS';

export const READ_REQUESTED = 'partner/READ_REQUESTED';
export const READ_SUCCESS = 'partner/READ_SUCCESS';
export const READ_FAILED = 'partner/READ_FAILED';

export const LOGIN_REQUESTED = 'partner/LOGIN_REQUESTED';
export const LOGIN_SUCCESS = 'partner/LOGIN_SUCCESS';
export const LOGIN_FAILED = 'partner/LOGIN_FAILED';

export const LOGOUT_REQUESTED = 'partner/LOGOUT_REQUESTED';
export const LOGOUT_SUCCESS = 'partner/LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'partner/LOGOUT_FAILED';

/***************************************************************************
 *                                                                          *
 * Initial State                                                            *
 *                                                                          *
 ***************************************************************************/
const initialState = {
  list: [], // list of partners
  isReading: false, // is in reading process and filling partner list
  error: null, // error message store here
  success: null, // success message store here
  isLoggedIn: false, // is partner logged in
  isLogining: false, // is trying to login
  loggedInUser: null // partner record that logged in the panel
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
        success: null
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

/***************************************************************************
 *                                                                          *
 * Action Creators                                                          *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * read partners                                                            *
 *                                                                          *
 ***************************************************************************/
export const Read = () => {
  return dispatch => {
    dispatch({
      type: READ_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/partner',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: READ_FAILED,
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
          type: READ_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

/***************************************************************************
 *                                                                          *
 * login as a partner                                                       *
 *                                                                          *
 ***************************************************************************/
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
          type: LOGIN_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

/***************************************************************************
 *                                                                          *
 * logout partner                                                           *
 *                                                                          *
 ***************************************************************************/
export const Logout = () => {
  return dispatch => {
    dispatch({
      type: LOGOUT_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/partner/logout',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: LOGOUT_FAILED,
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
          type: LOGOUT_SUCCESS
        });
      }
    );
  };
};
