import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('should render app', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
