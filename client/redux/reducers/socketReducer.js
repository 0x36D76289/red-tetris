const initialState = {
  connected: false,
  socket: null,
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SOCKET_CONNECTED":
      return {
        ...state,
        connected: true,
        socket: action.payload,
      };

    case "SOCKET_DISCONNECTED":
      return {
        ...state,
        connected: false,
      };

    default:
      return state;
  }
};

export default socketReducer;
