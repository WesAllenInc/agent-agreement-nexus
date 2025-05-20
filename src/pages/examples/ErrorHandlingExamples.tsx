import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useAsync } from '@/hooks/useAsync';
import { withErrorHandling } from '@/components/hoc/withErrorHandling';
import { useError } from '@/contexts/ErrorContext';
import { handleError, tryCatch, ErrorType, AppError } from '@/utils/errorHandling';
import { toast } from 'sonner';
import AsyncDataFetchExample from '@/components/examples/AsyncDataFetchExample';
import WithErrorHandlingExample from '@/components/examples/WithErrorHandlingExample';

// Component that will throw an error for the ErrorBoundary example
const ErrorThrower = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('This is a simulated error thrown from a component');
  }
  return <p>No error thrown. Click the button to simulate an error.</p>;
};

// Simple component to demonstrate withErrorHandling HOC
const SimpleComponent = () => (
  <div className="p-4 border rounded">
    <p>This is a simple component wrapped with the withErrorHandling HOC</p>
  </div>
);

const WrappedComponent = withErrorHandling(SimpleComponent);

const ErrorHandlingExamples = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { error: globalError, setError: setGlobalError, clearError } = useError();
  
  // For useAsync example
  const asyncOperation = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const random = Math.random();
    if (random < 0.5) {
      throw new Error('Simulated async error');
    }
    return { success: true, data: 'Async operation completed successfully' };
  };

  const { 
    execute, 
    loading: asyncLoading, 
    error: asyncError, 
    data: asyncData,
    reset: resetAsync
  } = useAsync(asyncOperation);

  // For tryCatch example
  const handleTryCatch = async () => {
    const [result, error] = await tryCatch(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (Math.random() < 0.5) {
          throw new Error('Error in tryCatch example');
        }
        return 'Operation succeeded';
      },
      { 
        showToast: true,
        context: { source: 'tryCatch example' }
      }
    );

    if (result) {
      toast.success(`Result: ${result}`);
    }
  };

  // For handleError example
  const simulateHandleError = () => {
    try {
      throw new Error('This is a simulated error for handleError');
    } catch (err) {
      handleError(err, { 
        showToast: true,
        context: { component: 'ErrorHandlingExamples' }
      });
    }
  };

  // For AppError example
  const createAppError = (type: ErrorType) => {
    const error = new AppError(
      `This is a simulated ${type} error`,
      type,
      new Error('Original error'),
      { source: 'AppError example' }
    );
    
    handleError(error);
  };

  // For global error example
  const setGlobalErrorExample = () => {
    setGlobalError(new Error('This is a global error example'));
  };

  // For loading example
  const toggleLoading = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error Handling Examples</h1>
          <p className="text-muted-foreground mt-2">
            Examples of various error handling patterns in the application
          </p>
        </div>

        <Tabs defaultValue="components">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">UI Components</TabsTrigger>
            <TabsTrigger value="hooks">Hooks & HOCs</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="examples">Real Examples</TabsTrigger>
          </TabsList>

          {/* UI Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ErrorMessage Component</CardTitle>
                <CardDescription>
                  Basic error message display with optional retry functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ErrorMessage 
                  title="Basic Error Message" 
                  message="This is a simple error message without retry"
                />
                
                <ErrorMessage 
                  title="Error with Retry" 
                  message="This error message has a retry button"
                  onRetry={() => toast.success('Retry clicked')}
                />
                
                <ErrorMessage 
                  title="Custom Error" 
                  message="This error has a custom action"
                  action={
                    <Button variant="outline" onClick={() => toast.success('Custom action clicked')}>
                      Custom Action
                    </Button>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading Component</CardTitle>
                <CardDescription>
                  Loading indicator with customizable text and size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <Loading size={16} text="Small loader" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <Loading size={24} text="Medium loader" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <Loading size={32} text="Large loader" />
                    </CardContent>
                  </Card>
                </div>
                
                <Button onClick={toggleLoading}>
                  Show loading for 3 seconds
                </Button>
                
                {showLoading && (
                  <div className="border rounded p-6">
                    <Loading text="Loading for 3 seconds..." />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ErrorBoundary Component</CardTitle>
                <CardDescription>
                  Catches errors in child components and displays a fallback UI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ErrorBoundary>
                  <div className="border rounded p-6">
                    <ErrorThrower shouldThrow={shouldThrow} />
                    <Button 
                      variant="destructive" 
                      onClick={() => setShouldThrow(prev => !prev)}
                      className="mt-4"
                    >
                      {shouldThrow ? 'Reset Error' : 'Throw Error'}
                    </Button>
                  </div>
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hooks & HOCs Tab */}
          <TabsContent value="hooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>useAsync Hook</CardTitle>
                <CardDescription>
                  Hook for handling async operations with loading and error states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded p-6">
                  {asyncLoading && <Loading text="Async operation in progress..." />}
                  
                  {asyncError && (
                    <ErrorMessage 
                      title="Async Error" 
                      error={asyncError}
                      onRetry={resetAsync}
                    />
                  )}
                  
                  {!asyncLoading && !asyncError && asyncData && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
                      <p>Result: {JSON.stringify(asyncData)}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={execute} 
                    disabled={asyncLoading}
                    className="mt-4"
                  >
                    Execute Async Operation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>withErrorHandling HOC</CardTitle>
                <CardDescription>
                  Higher-order component for adding error handling to any component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <WrappedComponent />
                  
                  <WrappedComponent 
                    loading={true} 
                    loadingText="Loading component..." 
                  />
                  
                  <WrappedComponent 
                    error={new Error('Example error')} 
                    onRetry={() => toast.success('Retry clicked')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>useError Hook</CardTitle>
                <CardDescription>
                  Hook for accessing the global error context
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded p-6">
                  <p className="mb-4">
                    Current global error: {globalError ? globalError.message : 'None'}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={setGlobalErrorExample}
                      variant="destructive"
                    >
                      Set Global Error
                    </Button>
                    
                    <Button 
                      onClick={clearError}
                      variant="outline"
                      disabled={!globalError}
                    >
                      Clear Global Error
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilities Tab */}
          <TabsContent value="utilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>handleError Utility</CardTitle>
                <CardDescription>
                  Standardized error handling with logging and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={simulateHandleError}
                  variant="destructive"
                >
                  Simulate Error
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>tryCatch Utility</CardTitle>
                <CardDescription>
                  Simplified try/catch pattern with standardized error handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleTryCatch}>
                  Run tryCatch Example
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AppError Class</CardTitle>
                <CardDescription>
                  Custom error class with additional context and type information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => createAppError(ErrorType.AUTHENTICATION)}
                  >
                    Auth Error
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => createAppError(ErrorType.VALIDATION)}
                  >
                    Validation Error
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => createAppError(ErrorType.NETWORK)}
                  >
                    Network Error
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AsyncDataFetchExample</CardTitle>
                <CardDescription>
                  Example of data fetching with useAsync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AsyncDataFetchExample 
                  title="Users" 
                  table="users"
                  renderItem={(item) => (
                    <div className="p-4 border rounded">
                      <p><strong>ID:</strong> {item.id}</p>
                      <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {item.email || 'N/A'}</p>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WithErrorHandlingExample</CardTitle>
                <CardDescription>
                  Example of using the withErrorHandling HOC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithErrorHandlingExample />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ErrorHandlingExamples;
