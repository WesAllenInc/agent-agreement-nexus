import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useLogStore, ActivityLog } from '@/state/logStore';
import { toast } from 'sonner';

interface ActivityLogsProps {
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  showExport?: boolean;
  className?: string;
  entityFilter?: string;
  actionFilter?: string;
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({
  limit = 10,
  showFilters = true,
  showPagination = true,
  showExport = true,
  className = '',
  entityFilter = '',
  actionFilter = '',
}) => {
  // Get state and actions from the log store
  const { 
    logs, 
    totalLogs, 
    totalPages, 
    filters, 
    isLoading, 
    fetchLogs, 
    setFilter, 
    resetFilters, 
    nextPage, 
    prevPage, 
    goToPage, 
    exportLogs 
  } = useLogStore();

  // Set initial filters
  useEffect(() => {
    // Set the limit from props
    setFilter('limit', limit);
    
    // Set entity filter if provided
    if (entityFilter) {
      setFilter('entityFilter', entityFilter);
    }
    
    // Set action filter if provided
    if (actionFilter) {
      setFilter('actionFilter', actionFilter);
    }
    
    // Fetch logs with these filters
    fetchLogs();
  }, [limit, entityFilter, actionFilter]);

  // Handle export
  const handleExport = async () => {
    toast.info('Preparing export...');
    const url = await exportLogs();
    if (url) {
      toast.success('Export completed');
    }
  };

  // Get unique action types for filter
  const getActionTypes = () => {
    const actions = new Set(logs.map(log => log.action));
    return Array.from(actions).filter(Boolean) as string[];
  };

  // Get unique entity types for filter
  const getEntityTypes = () => {
    const entities = new Set(logs.map(log => log.entity_type));
    return Array.from(entities).filter(Boolean) as string[];
  };

  // Render badge for action type
  const renderActionBadge = (action: string) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    
    switch (action.toLowerCase()) {
      case 'create':
        variant = 'default';
        break;
      case 'update':
        variant = 'secondary';
        break;
      case 'delete':
        variant = 'destructive';
        break;
      case 'login':
      case 'logout':
      case 'view':
        variant = 'outline';
        break;
      default:
        variant = 'default';
    }
    
    return <Badge variant={variant}>{action}</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>
          View system activity and user actions
        </CardDescription>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={filters.searchTerm}
                onChange={(e) => setFilter('searchTerm', e.target.value)}
              />
            </div>
            
            <Select 
              value={filters.actionFilter} 
              onValueChange={(value) => setFilter('actionFilter', value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                {getActionTypes().map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.entityFilter} 
              onValueChange={(value) => setFilter('entityFilter', value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Entities</SelectItem>
                {getEntityTypes().map(entity => (
                  <SelectItem key={entity} value={entity}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchLogs}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              {showExport && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExport}
                  title="Export CSV"
                  disabled={isLoading || logs.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>{log.user_email}</TableCell>
                      <TableCell>{renderActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{log.entity_type}</span>
                        <span className="text-xs text-muted-foreground block truncate max-w-[120px]">
                          {log.entity_id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.info(
                              <pre className="max-h-[300px] overflow-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>,
                              {
                                duration: 10000,
                              }
                            );
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {showPagination && totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevPage}
                        disabled={filters.page === 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        &larr;
                      </Button>
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (filters.page <= 3) {
                        pageToShow = i + 1;
                      } else if (filters.page >= totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      } else {
                        pageToShow = filters.page - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageToShow}>
                          <Button
                            variant={filters.page === pageToShow ? "default" : "outline"}
                            size="icon"
                            onClick={() => goToPage(pageToShow)}
                          >
                            {pageToShow}
                          </Button>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextPage}
                        disabled={filters.page === totalPages}
                      >
                        <span className="sr-only">Go to next page</span>
                        &rarr;
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Showing {(filters.page - 1) * filters.limit + 1}-{Math.min(filters.page * filters.limit, totalLogs)} of {totalLogs} logs
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
