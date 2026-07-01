import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl overflow-auto border border-red-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{this.state.error && this.state.error.toString()}</h2>
            <pre className="text-sm text-red-800 whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
