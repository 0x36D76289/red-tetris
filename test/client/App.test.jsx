import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../src/client/redux/store';
import App from '../../src/client/App.jsx';

describe('App', () => {
  it('renders Red Tetris title', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Red Tetris')).toBeInTheDocument();
  });

  it('renders welcome message on home route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Welcome to Red Tetris!')).toBeInTheDocument();
  });

  it('renders game room on game route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/room1/player1']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Game Room')).toBeInTheDocument();
  });
});
