import { createStore } from "redux";
import { Provider } from "react-redux";

const initialState = {
  user: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

const store = createStore(rootReducer);

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export { store, StoreProvider };
