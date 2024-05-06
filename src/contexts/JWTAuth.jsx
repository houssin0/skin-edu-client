import LoadingScreen from "components/LoadingScreen";
import jwtDecode from "jwt-decode";
import { createContext, useEffect, useReducer } from "react";
import axios from "utils/axios";

const initialState = {
  isAuthenticated: false,
  isInitialized: false, 
  user: null,
};

const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: false,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: (email, password) => Promise.resolve(),
  logout: () => {},
  register: (name, email, password, userType) => Promise.resolve(),
});

export const JWTAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const data = await response.json();
    setSession(data.accessToken);
    dispatch({
      type: "LOGIN",
      payload: {
        user: data.user,
      },
    }); 
  };

  const register = async (name, email, password, userType) => {
    const response = await fetch("/api/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        userType,
      })
    });
    const data = await response.json();
    setSession(data.accessToken);
    dispatch({
      type: "REGISTER",
      payload: {
        user: data.user,
      },
    }); 
  };
  

  const logout = () => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const { data } = await axios.get("/api/auth/profile");
          dispatch({
            type: "INIT",
            payload: {
              user: data.user,
              isAuthenticated: true,
            },
          });
        } else {
          dispatch({
            type: "INIT",
            payload: {
              user: null,
              isAuthenticated: false,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
          payload: {
            user: null,
            isAuthenticated: false,
          },
        });
      }
    })();
  }, []);

  if (!state.isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
