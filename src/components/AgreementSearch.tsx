import { Input } from './ui/input';
import { Search } from 'lucide-react';
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

export interface AgreementSearchFilters {
  searchTerm: string;
  status: AgreementStatus | 'all';
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface AgreementSearchProps {
  filters: AgreementSearchFilters;
  onFiltersChange: (filters: AgreementSearchFilters) => void;
  onReset: () => void;
}

export function AgreementSearch({ filters, onFiltersChange, onReset }: AgreementSearchProps) {
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
    </div>
  );
}
