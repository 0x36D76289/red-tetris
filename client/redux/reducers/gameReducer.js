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

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "JOIN_SUCCESS":
      return {
        ...state,
        roomName: action.payload.roomName,
        playerName: action.payload.playerName,
        isHost: action.payload.isHost,
        error: null,
      };

    case "JOIN_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };

    case "GAME_STATE_UPDATE":
      return {
        ...state,
        players: action.payload.players,
        isStarted: action.payload.isStarted,
      };

    case "GAME_STARTED":
      return {
        ...state,
        isStarted: true,
        isFinished: false,
        gameOver: false,
        nextPieces: action.payload.pieces,
        field: Array(20)
          .fill(null)
          .map(() => Array(10).fill(0)),
      };

    case "GAME_ENDED":
      return {
        ...state,
        isFinished: true,
        winner: action.payload.winner,
      };

    case "HOST_ASSIGNED":
      return {
        ...state,
        isHost: true,
      };

    case "SPECTRUMS_UPDATE":
      return {
        ...state,
        spectrums: action.payload,
      };

    case "NEXT_PIECE":
      return {
        ...state,
        nextPieces: [...state.nextPieces, action.payload.piece],
      };

    case "USE_PIECE":
      return {
        ...state,
        nextPieces: state.nextPieces.slice(1),
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        field: action.payload,
      };

    case "PENALTY_RECEIVED":
      return {
        ...state,
        field: action.payload.field,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameOver: true,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "LEAVE_GAME":
      return initialState;

    default:
      return state;
  }
};

export default gameReducer;
