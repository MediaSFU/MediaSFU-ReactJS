import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ModernPreJoinPage from './ModernPreJoinPage';
import { checkLimitsAndMakeRequest } from '../../methods/utils/checkLimitsAndMakeRequest';

jest.mock('../../methods/utils/checkLimitsAndMakeRequest', () => ({
  checkLimitsAndMakeRequest: jest.fn().mockResolvedValue(undefined),
}));

test('keeps the creator role marker while connecting with the exact registered name', async () => {
  const updateMember = jest.fn();
  const createMediaSFURoom = jest.fn().mockResolvedValue({
    success: true,
    data: {
      roomName: 's-room',
      secret: 's'.repeat(64),
      link: 'https://sp.example.test',
    },
  });
  const parameters = {
    updateMember,
    updateIsLoadingModalVisible: jest.fn(),
    connectLocalSocket: jest.fn(),
    updateSocket: jest.fn(),
    updateLocalSocket: jest.fn(),
    updateValidated: jest.fn(),
    updateApiUserName: jest.fn(),
    updateApiToken: jest.fn(),
    updateLink: jest.fn(),
    updateRoomName: jest.fn(),
  } as any;

  render(
    <ModernPreJoinPage
      parameters={parameters}
      credentials={{ apiUserName: 'staging-user', apiKey: 'k'.repeat(64) }}
      createMediaSFURoom={createMediaSFURoom}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Switch to Create Mode' }));
  fireEvent.change(screen.getByPlaceholderText('Display Name (2-10 characters)'), {
    target: { value: 'BlurHost' },
  });
  const spinButtons = screen.getAllByRole('spinbutton');
  fireEvent.change(spinButtons[0], { target: { value: '2' } });
  fireEvent.change(spinButtons[1], { target: { value: '15' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'conference' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

  await waitFor(() => expect(createMediaSFURoom).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(checkLimitsAndMakeRequest).toHaveBeenCalledWith(
      expect.objectContaining({ userName: 'BlurHost' }),
    ),
  );
  expect(updateMember).toHaveBeenCalledWith('BlurHost_2');
});
