import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  
  // Default props
  public static defaultProps = {
    showDetails: process.env.NODE_ENV === 'development',
    onReset: () => window.location.reload()
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Capture additional context for better debugging
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        },
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        location: {
          pathname: window.location.pathname,
          href: window.location.href
        },
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language
        }
      },
      tags: {
        errorType: error.name,
        errorSource: 'react_error_boundary'
      }
    });
  }
  
  // Reset the error state
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full shadow-lg border-destructive/20">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-xl text-destructive">Something went wrong</CardTitle>
              </div>
              <CardDescription>
                The application encountered an unexpected error. Our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {this.props.showDetails && this.state.error && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Error details:</p>
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    <p className="font-mono text-xs text-muted-foreground break-all">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32 scrollbar-thin">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Go back
              </Button>
              <Button 
                onClick={this.handleReset}
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reload page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

