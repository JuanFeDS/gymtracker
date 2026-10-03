import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-300 mb-6">
              La aplicación encontró un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Recargar página
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-gray-400 cursor-pointer text-sm">
                  Detalles técnicos
                </summary>
                <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
