import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <FiAlertTriangle size={72} strokeWidth={1.5} />
            </div>
            <h1 className="error-title">Đã xảy ra lỗi</h1>
            <p className="error-message">
              Xin lỗi, có gì đó không ổn. Vui lòng thử lại.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Chi tiết lỗi (Development only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="error-actions">
              <button
                className="error-button"
                onClick={this.handleReset}
              >
                Thử lại
              </button>
              <button
                className="error-button-secondary"
                onClick={() => (window.location.href = '/')}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
