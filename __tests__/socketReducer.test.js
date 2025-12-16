import socketReducer from "../client/redux/reducers/socketReducer";

describe("Socket Reducer", () => {
  it("should return initial state", () => {
    const state = socketReducer(undefined, {});

    expect(state).toEqual({
      connected: false,
      socket: null,
    });
  });

  it("should handle SOCKET_CONNECTED", () => {
    const mockSocket = { id: "socket123" };
    const state = socketReducer(undefined, {
      type: "SOCKET_CONNECTED",
      payload: mockSocket,
    });

    expect(state).toEqual({
      connected: true,
      socket: mockSocket,
    });
  });

  it("should handle SOCKET_DISCONNECTED", () => {
    const initialState = {
      connected: true,
      socket: { id: "socket123" },
    };

    const state = socketReducer(initialState, {
      type: "SOCKET_DISCONNECTED",
    });

    expect(state.connected).toBe(false);
    // Note: socketReducer doesn't clear socket on disconnect, only sets connected to false
  });
});
