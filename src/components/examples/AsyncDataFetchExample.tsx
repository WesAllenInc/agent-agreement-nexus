import React from 'react';
import { useAsync } from '@/hooks/useAsync';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface DataFetchExampleProps {
  /**
   * Title for the card
   */
  title?: string;
  
  /**
   * Table to fetch data from
   */
  table: string;
  
  /**
   * Optional query filter
   */
  filter?: Record<string, any>;
  
  /**
   * Optional render function for the data
   */
  renderItem?: (item: any) => React.ReactNode;
}

/**
 * Example component that demonstrates using useAsync for data fetching
 * with centralized loading and error handling
 */
export function AsyncDataFetchExample({
  title = 'Data',
  table,
  filter,
  renderItem
}: DataFetchExampleProps) {
  const fetchData = async () => {
    let query = supabase.from(table).select('*');
    
    // Apply filters if provided
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const {
    data,
    loading,
    error,
    execute: refetch,
    reset
  } = useAsync(fetchData, { immediate: true });

  const handleRetry = () => {
    reset();
    refetch();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <Loading text={`Loading ${title.toLowerCase()}...`} />}
        
        {error && (
          <ErrorMessage
            title={`Error Loading ${title}`}
            error={error}
            onRetry={handleRetry}
          />
        )}
        
        {!loading && !error && data && (
          <>
            {data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {title.toLowerCase()} found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((item: any) => (
                  <div key={item.id}>
                    {renderItem ? renderItem(item) : JSON.stringify(item)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AsyncDataFetchExample;
