import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test("Doesn't explode", () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const root = getByTestId("home-root");
  expect(root).toBeInTheDocument();
});
