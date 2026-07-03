import { Component, Fragment } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, retryKey: 0 };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState(prev => ({ hasError: false, error: null, retryKey: prev.retryKey + 1 }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#1e293b',
          background: '#f8fafc', padding: '2rem', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Algo salió mal</h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Ocurrió un error inesperado. Esto puede deberse a un problema de conexión o a un error temporal.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={this.handleRetry} style={{
              padding: '0.65rem 1.5rem', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem'
            }}>
              Reintentar
            </button>
            <button onClick={this.handleGoHome} style={{
              padding: '0.65rem 1.5rem', background: '#64748b', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem'
            }}>
              Volver al inicio
            </button>
          </div>
        </div>
      );
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
