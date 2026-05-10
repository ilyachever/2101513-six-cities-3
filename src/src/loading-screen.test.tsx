import { render } from '@testing-library/react';
import LoadingScreen from './loading-screen';

describe('Component: LoadingScreen', () => {
  it('should have correct', () => {
    const { container } = render(<LoadingScreen />);

    const loadingScreen = container.querySelector('.loading-screen');
    const spinner = container.querySelector('.spinner');

    expect(loadingScreen).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner?.parentElement).toBe(loadingScreen);
  });
});

