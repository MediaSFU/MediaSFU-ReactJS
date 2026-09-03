import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModernBreakoutRoomsModal } from './ModernBreakoutRoomsModal';

test('inline Start stays disabled until the current room plan is saved', () => {
  const state: any = {
    breakoutRooms: [[{ name: 'Learner', breakRoom: 0 }]],
    participants: [{ name: 'Learner', islevel: '1', breakRoom: 0 }],
    breakOutRoomStarted: false,
    canStartBreakout: false,
    updateBreakoutRooms: jest.fn(),
    updateCanStartBreakout: jest.fn((value: boolean) => { state.canStartBreakout = value; }),
    getCurrentParams: () => state,
    getUpdatedAllParams: () => state,
    showAlert: jest.fn(),
  };

  const view = render(
    <ModernBreakoutRoomsModal
      isVisible
      onBreakoutRoomsClose={jest.fn()}
      parameters={{ ...state }}
      renderMode="inline"
    />,
  );

  const start = screen.getByRole('button', { name: /^Start$/i });
  expect(start).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));
  expect(state.updateCanStartBreakout).toHaveBeenCalledWith(true);

  view.rerender(
    <ModernBreakoutRoomsModal
      isVisible
      onBreakoutRoomsClose={jest.fn()}
      parameters={{ ...state }}
      renderMode="inline"
    />,
  );
  expect(screen.getByRole('button', { name: /^Start$/i })).toBeEnabled();
});
