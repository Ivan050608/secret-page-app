// components/AuthForm.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from './AuthForm';
import { useRouter } from 'next/navigation';
import * as authHelpers from '@/lib/authHelpers';


// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the loginUser and registerUser helpers
jest.mock('@/lib/authHelpers', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

describe('AuthForm', () => {
  const push = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it('renders email and password input fields', () => {
    render(<AuthForm type="login" />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('sets password input type to password', () => {
    render(<AuthForm type="login" />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows error message on failed login', async () => {
    authHelpers.loginUser.mockResolvedValue({ error: { message: 'Invalid credentials' } });

    render(<AuthForm type="login" />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for error to appear
    const errorMessage = await screen.findByText('Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });

  it('redirects on successful login', async () => {
    authHelpers.loginUser.mockResolvedValue({ error: null });

    render(<AuthForm type="login" />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'correctpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for push to be called
    await screen.findByRole('button', { name: /login/i }); // wait for async finish
    expect(push).toHaveBeenCalledWith('/secret-page-1');
  });
});
