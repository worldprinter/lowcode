import { render } from '@testing-library/react';

import Engine from './engine';

describe('Engine', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Engine />);
    expect(baseElement).toBeTruthy();
  });
});
