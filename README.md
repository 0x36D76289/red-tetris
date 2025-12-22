# Red Tetris 🎮

A networked multiplayer Tetris game built with Full Stack JavaScript.

## Features

- **Real-time Multiplayer**: Play against friends in the same room
- **Penalty Lines**: Clear multiple lines to send penalties to opponents
- **Live Spectrum View**: See opponents' board heights in real-time
- **Same Piece Sequence**: All players in a room receive identical pieces
- **Room-based System**: Join games via URL (e.g., `/room/player`)

## Tech Stack

### Server

- **Node.js** with ES Modules
- **Express** for HTTP server
- **Socket.io** for real-time communication
- **OOP Design**: Classes for Player, Piece, and Game

### Client

- **React 18** with Hooks (functional components only)
- **Redux Toolkit** for state management
- **React Router** for SPA navigation
- **Vite** for bundling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

Start both server and client in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Server only (port 3004)
npm run dev:server

# Client only (port 3000)
npm run dev:client
```

### Production

Build and start:

```bash
npm run build
npm start
```

## How to Play

1. Open the app in your browser
2. Enter a room name and your player name
3. Share the room name with friends
4. The host (first player) can start the game
5. Use controls to play:
   - **←/→**: Move piece horizontally
   - **↑**: Rotate piece
   - **↓**: Soft drop
   - **Space**: Hard drop

## Game Rules

- 10x20 playing field
- Original Tetrimino shapes (I, O, T, S, Z, J, L)
- Clearing lines adds penalty lines to opponents (n-1 lines)
- Last player standing wins
- Solo mode supported

## Testing

Run tests with coverage:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage targets:

- Statements: 70%+
- Functions: 70%+
- Lines: 70%+
- Branches: 50%+

## Project Structure

```
red-tetris/
├── src/
│   ├── server/
│   │   ├── models/
│   │   │   ├── Game.js      # Game class (OOP)
│   │   │   ├── Player.js    # Player class (OOP)
│   │   │   └── Piece.js     # Piece class (OOP)
│   │   ├── GameManager.js   # Game management
│   │   ├── socketHandlers.js # Socket.io events
│   │   └── index.js         # Server entry point
│   ├── client/
│   │   ├── components/      # React components
│   │   ├── game/
│   │   │   └── tetris.js    # Pure functions (game logic)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── socket/          # Socket.io client
│   │   ├── store/           # Redux store
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── test/                # Test files
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

### Client-Server Communication

```
Client                    Server
  |                         |
  |-- join(room, name) -->  |
  |<-- game:update ---------|
  |                         |
  |<-- game:started --------|
  |                         |
  |-- board:update ------>  |
  |<-- spectrum:update -----|
  |                         |
  |-- lines:cleared ----->  |
  |<-- penalty:add ---------|
  |                         |
  |-- player:eliminated ->  |
  |<-- game:over -----------|
```

### State Management

- Server: Authoritative game state (rooms, players, pieces)
- Client: Local game state (board, current piece, rendering)

## License

MIT
