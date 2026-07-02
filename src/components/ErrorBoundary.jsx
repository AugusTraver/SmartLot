import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
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
          <button onClick={this.handleRetry} style={{
            padding: '0.65rem 1.5rem', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem'
          }}>
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
