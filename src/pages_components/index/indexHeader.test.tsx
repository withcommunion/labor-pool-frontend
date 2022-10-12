import { render, screen } from '@testing-library/react';
import IndexHeader from './indexHeader';

describe('Index', () => {
  it('renders a heading', () => {
    render(<IndexHeader />);

    const heading = screen.getByRole('heading', {
      name: /welcome to communion/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
