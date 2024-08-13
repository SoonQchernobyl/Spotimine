"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

type State = {
  feature: string;
  currentTrackId: string;
  tracks: any[];
};

type Action =
  | { type: "SET_FEATURE"; payload: string }
  | { type: "SET_CURRENT_TRACK"; payload: string }
  | { type: "SET_TRACKS"; payload: any[] };

const initialState: State = {
  feature: "",
  currentTrackId: "",
  tracks: [],
};

const SwipeContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

const swipeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FEATURE":
      return { ...state, feature: action.payload };
    case "SET_CURRENT_TRACK":
      return { ...state, currentTrackId: action.payload };
    case "SET_TRACKS":
      return { ...state, tracks: action.payload };
    default:
      return state;
  }
};

export const SwipeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(swipeReducer, initialState);

  return (
    <SwipeContext.Provider value={{ state, dispatch }}>
      {children}
    </SwipeContext.Provider>
  );
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (context === undefined) {
    throw new Error("useSwipe must be used within a SwipeProvider");
  }
  return context;
};
