import { Input } from './ui/input';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { DatePicker } from './ui/date-picker';
import { Button } from './ui/button';
import { AgreementStatus } from '../types/agreement';
import { Checkbox } from './ui/checkbox';

export interface AdminAgreementFilters {
  searchTerm: string;
  status: AgreementStatus | 'all';
  dateFrom: Date | null;
  dateTo: Date | null;
  sortField: 'created_at' | 'file_name' | 'file_size' | 'status';
  sortDirection: 'asc' | 'desc';
}

interface AdminAgreementSearchProps {
  filters: AdminAgreementFilters;
  onFiltersChange: (filters: AdminAgreementFilters) => void;
  onReset: () => void;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  totalCount: number;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
}

export function AdminAgreementSearch({
  filters,
  onFiltersChange,
  onReset,
  selectedIds,
  onSelectAll,
  totalCount,
  onBulkArchive,
  onBulkDelete,
}: AdminAgreementSearchProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as AgreementStatus | 'all' });
  };

  const handleDateFromChange = (date: Date | null) => {
    onFiltersChange({ ...filters, dateFrom: date });
  };

  const handleDateToChange = (date: Date | null) => {
    onFiltersChange({ ...filters, dateTo: date });
  };

  const handleSortChange = (field: AdminAgreementFilters['sortField']) => {
    if (field === filters.sortField) {
      onFiltersChange({
        ...filters,
        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onFiltersChange({
        ...filters,
        sortField: field,
        sortDirection: 'asc',
      });
    }
  };

  const getSortIcon = (field: AdminAgreementFilters['sortField']) => {
    if (field !== filters.sortField) return null;
    return filters.sortDirection === 'asc' ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Date from:</span>
          <DatePicker
            selected={filters.dateFrom}
            onSelect={handleDateFromChange}
            maxDate={filters.dateTo || new Date()}
          />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Date to:</span>
          <DatePicker
            selected={filters.dateTo}
            onSelect={handleDateToChange}
            minDate={filters.dateFrom || undefined}
            maxDate={new Date()}
          />
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          Reset Filters
        </Button>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length > 0}
              onClick={(e) => {
                e.stopPropagation();
                onSelectAll(selectedIds.length < totalCount);
              }}
            />
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkArchive}
              >
                Archive Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleSortChange('file_name')}
          >
            Name {getSortIcon('file_name')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleSortChange('created_at')}
          >
            Date {getSortIcon('created_at')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleSortChange('file_size')}
          >
            Size {getSortIcon('file_size')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleSortChange('status')}
          >
            Status {getSortIcon('status')}
          </Button>
        </div>
      </div>
    </div>
  );
}

