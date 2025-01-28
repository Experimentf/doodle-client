import { Component, PropsWithChildren, ReactNode } from 'react';

import { ErrorFromServer } from '@/utils/error';

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  error: ErrorFromServer | Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: ErrorBoundaryState['error']) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error instanceof ErrorFromServer) {
      return <p>{error.message}</p>;
    }

    if (error) return fallback;

    return children;
  }
}

export default ErrorBoundary;
