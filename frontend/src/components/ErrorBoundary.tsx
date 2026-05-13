import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const loadedBundle =
        typeof document !== 'undefined'
          ? Array.from(document.scripts)
              .map((script) => script.getAttribute('src'))
              .find((src) => src?.includes('/assets/index-')) ?? 'unknown bundle'
          : 'unknown bundle';

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardHeader className="text-center">
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try reloading the page.
              </p>
              {this.state.error && (
                <div className="bg-muted p-3 rounded text-xs text-left overflow-auto max-h-40 space-y-2">
                  <div>
                    <span className="font-semibold">Error:</span>{' '}
                    <code>{this.state.error.message}</code>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold">Bundle:</span>{' '}
                    <code>{loadedBundle}</code>
                  </div>
                </div>
              )}
              <Button onClick={this.handleReload} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
