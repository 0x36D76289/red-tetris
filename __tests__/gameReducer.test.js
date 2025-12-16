import gameReducer from "../client/redux/reducers/gameReducer";

describe("Game Reducer", () => {
  const initialState = {
    roomName: null,
    playerName: null,
    isHost: false,
    isStarted: false,
    isFinished: false,
    players: [],
    spectrums: {},
    currentPiece: null,
    nextPieces: [],
    field: Array(20)
      .fill(null)
      .map(() => Array(10).fill(0)),
    gameOver: false,
    winner: null,
    error: null,
  };

  it("should return initial state", () => {
    expect(gameReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle JOIN_SUCCESS", () => {
    const action = {
      type: "JOIN_SUCCESS",
      payload: {
        roomName: "TestRoom",
        playerName: "TestPlayer",
        isHost: true,
      },
    };

    const state = gameReducer(initialState, action);

    expect(state.roomName).toBe("TestRoom");
    expect(state.playerName).toBe("TestPlayer");
    expect(state.isHost).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle JOIN_ERROR", () => {
    const action = {
      type: "JOIN_ERROR",
      payload: {
        error: "Room is full",
      },
    };

    const state = gameReducer(initialState, action);

    expect(state.error).toBe("Room is full");
  });

  it("should handle GAME_STARTED", () => {
    const action = {
      type: "GAME_STARTED",
      payload: {
        pieces: ["I", "O", "T", "S", "Z"],
      },
    };

    const state = gameReducer(initialState, action);

    expect(state.isStarted).toBe(true);
    expect(state.isFinished).toBe(false);
    expect(state.gameOver).toBe(false);
    expect(state.nextPieces).toEqual(["I", "O", "T", "S", "Z"]);
  });

  it("should handle GAME_ENDED", () => {
    const action = {
      type: "GAME_ENDED",
      payload: {
        winner: "TestPlayer",
      },
    };

    const state = gameReducer(initialState, action);

    expect(state.isFinished).toBe(true);
    expect(state.winner).toBe("TestPlayer");
  });

  it("should handle HOST_ASSIGNED", () => {
    const action = {
      type: "HOST_ASSIGNED",
    };

    const state = gameReducer(initialState, action);

    expect(state.isHost).toBe(true);
  });

  it("should handle SPECTRUMS_UPDATE", () => {
    const action = {
      type: "SPECTRUMS_UPDATE",
      payload: {
        Player1: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
        Player2: [0, 0, 1, 2, 3, 0, 0, 0, 0, 0],
      },
    };

    const state = gameReducer(initialState, action);

    expect(state.spectrums).toEqual(action.payload);
  });

  it("should handle GAME_OVER", () => {
    const action = {
      type: "GAME_OVER",
    };

    const state = gameReducer(initialState, action);

    expect(state.gameOver).toBe(true);
  });

  it("should handle LEAVE_GAME", () => {
    const modifiedState = {
      ...initialState,
      roomName: "TestRoom",
      playerName: "TestPlayer",
      isHost: true,
    };

    const action = {
      type: "LEAVE_GAME",
    };

    const state = gameReducer(modifiedState, action);

    expect(state).toEqual(initialState);
  });

  it("should handle NEXT_PIECE", () => {
    const modifiedState = {
      ...initialState,
      nextPieces: ["I", "O"],
    };

    const action = {
      type: "NEXT_PIECE",
      payload: { piece: "T" },
    };

    const state = gameReducer(modifiedState, action);

    expect(state.nextPieces).toEqual(["I", "O", "T"]);
  });

  it("should handle USE_PIECE", () => {
    const modifiedState = {
      ...initialState,
      nextPieces: ["I", "O", "T"],
    };

    const action = {
      type: "USE_PIECE",
    };

    const state = gameReducer(modifiedState, action);

    expect(state.nextPieces).toEqual(["O", "T"]);
  });

  it("should handle UPDATE_FIELD", () => {
    const newField = Array(20)
      .fill(null)
      .map(() => Array(10).fill(1));

    const action = {
      type: "UPDATE_FIELD",
      payload: newField,
    };

    const state = gameReducer(initialState, action);

    expect(state.field).toEqual(newField);
  });

  it("should handle PENALTY_RECEIVED", () => {
    const penaltyField = Array(20)
      .fill(null)
      .map(() => Array(10).fill(-1));

    const action = {
      type: "PENALTY_RECEIVED",
      payload: { field: penaltyField },
    };

    const state = gameReducer(initialState, action);

    expect(state.field).toEqual(penaltyField);
  });
});
