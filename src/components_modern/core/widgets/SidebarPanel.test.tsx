import React from 'react';
import { render, screen } from '@testing-library/react';
import { SidebarPanel } from './SidebarPanel';

const baseProps = {
  canNavigateBack: false,
  onNavigateBack: jest.fn(),
  onClose: jest.fn(),
  width: 320,
};

test('stays hook-safe while becoming visible and defaults to its container boundary', () => {
  const view = render(
    <SidebarPanel {...baseProps} activeSidebarContent="none">
      Room tools
    </SidebarPanel>,
  );

  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();

  view.rerender(
    <SidebarPanel {...baseProps} activeSidebarContent="permissions">
      Room tools
    </SidebarPanel>,
  );

  const panel = screen.getByRole('complementary', { name: 'Permissions' });
  expect(panel).toHaveStyle({ position: 'absolute', height: '100%', width: '320px' });
  expect(panel).toHaveTextContent('Room tools');
});

test('allows an explicit viewport-hosted surface', () => {
  render(
    <SidebarPanel
      {...baseProps}
      activeSidebarContent="messages"
      position="fixed"
      height="100vh"
    >
      Messages
    </SidebarPanel>,
  );

  expect(screen.getByRole('complementary', { name: 'Messages' }))
    .toHaveStyle({ position: 'fixed', height: '100vh' });
});
