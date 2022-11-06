import { createContext, useReducer } from "react";

export const CartContext = createContext();

const initial = {
  cart: null,
};

const reducer = (state, action) => {
  const { type, cartData } = action;

  switch (type) {
    case "ADD":
      return {
        cart: cartData,
      };
    default:
      throw new Error();
  }
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  );
};
