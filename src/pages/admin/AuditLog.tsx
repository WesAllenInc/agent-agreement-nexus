import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter,
  User,
  FileText,
  LogIn,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { t } from '../../utils/i18n';

interface AuditLogEvent {
  id: string;
  eventType: 'login' | 'logout' | 'agreement_created' | 'agreement_signed' | 'user_created' | 'password_changed' | 'mfa_enabled' | 'mfa_disabled';
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export default function AuditLog() {
  const [events, setEvents] = useState<AuditLogEvent[]>([
    {
      id: '1',
      eventType: 'login',
      userId: '101',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      metadata: {},
      timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
      id: '2',
      eventType: 'agreement_signed',
      userId: '102',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      metadata: {
        agreementId: 'AGR-1234',
        agreementTitle: 'Sales Contract #1234',
      },
      timestamp: new Date(Date.now() - 2 * 3600000),
    },
    {
      id: '3',
      eventType: 'user_created',
      userId: '103',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
      metadata: {
        createdBy: 'admin@example.com',
      },
      timestamp: new Date(Date.now() - 24 * 3600000),
    },
    {
      id: '4',
      eventType: 'mfa_enabled',
      userId: '101',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      metadata: {},
      timestamp: new Date(Date.now() - 48 * 3600000),
    },
  ]);
  
  const [sortField, setSortField] = useState<keyof AuditLogEvent>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    eventType: '',
    dateFrom: '',
    dateTo: '',
    userId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const handleSort = (field: keyof AuditLogEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleExport = (format: 'csv' | 'json') => {
    // In a real app, would call API to export data
    console.log(`Exporting audit log as ${format}`);
    alert(`Audit log exported as ${format}`);
  };
  
  const handleApplyFilters = () => {
    setIsLoading(true);
    // In a real app, would call API to filter data
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage(1);
    }, 500);
  };
  
  const handleResetFilters = () => {
    setFilters({
      eventType: '',
      dateFrom: '',
      dateTo: '',
      userId: '',
    });
  };
  
  const eventTypeIcons = {
    login: <LogIn size={16} className="text-blue-500" />,
    logout: <LogIn size={16} className="text-gray-500" />,
    agreement_created: <FileText size={16} className="text-green-500" />,
    agreement_signed: <FileText size={16} className="text-purple-500" />,
    user_created: <User size={16} className="text-orange-500" />,
    password_changed: <Lock size={16} className="text-red-500" />,
    mfa_enabled: <Lock size={16} className="text-green-500" />,
    mfa_disabled: <Lock size={16} className="text-red-500" />,
  };
  
  const eventTypeLabels = {
    login: 'User Login',
    logout: 'User Logout',
    agreement_created: 'Agreement Created',
    agreement_signed: 'Agreement Signed',
    user_created: 'User Created',
    password_changed: 'Password Changed',
    mfa_enabled: 'MFA Enabled',
    mfa_disabled: 'MFA Disabled',
  };
  
  // Sort and filter events
  let filteredEvents = [...events];
  
  if (filters.eventType) {
    filteredEvents = filteredEvents.filter(event => event.eventType === filters.eventType);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredEvents = filteredEvents.filter(event => event.timestamp >= fromDate);
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filteredEvents = filteredEvents.filter(event => event.timestamp <= toDate);
  }
  
  if (filters.userId) {
    filteredEvents = filteredEvents.filter(
      event => 
        event.userId.includes(filters.userId) || 
        event.userName.toLowerCase().includes(filters.userId.toLowerCase()) ||
        event.userEmail.toLowerCase().includes(filters.userId.toLowerCase())
    );
  }
  
  // Sort events
  filteredEvents.sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortDirection === 'asc' 
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime();
    }
    
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    
    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  
  // Paginate events
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('auditLog.title')}</h2>
          
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="filter-panel"
            >
              <Filter size={16} className="mr-1" />
              {t('auditLog.filter')}
            </button>
            
            <div className="relative">
              <button
                className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => handleExport('csv')}
              >
                <Download size={16} className="mr-1" />
                {t('auditLog.export')}
              </button>
              
              {/* Export dropdown could go here */}
            </div>
          </div>
        </div>
        
        {isFilterOpen && (
          <div id="filter-panel" className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="eventType">
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="">All Events</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="agreement_created">Agreement Created</option>
                <option value="agreement_signed">Agreement Signed</option>
                <option value="user_created">User Created</option>
                <option value="password_changed">Password Changed</option>
                <option value="mfa_enabled">MFA Enabled</option>
                <option value="mfa_disabled">MFA Disabled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="dateFrom">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="dateTo">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="userId">
                User
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Email or user ID"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            
            <div className="md:col-span-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Timestamp
                    {sortField === 'timestamp' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                  </tr>
                ))
              ) : paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                paginatedEvents.map(event => (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {eventTypeIcons[event.eventType]}
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {eventTypeLabels[event.eventType]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.userName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{event.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {expandedEventId === event.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedEventId === event.id && (
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            <h4 className="font-medium mb-2">Event Details</h4>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                              <div>
                                <dt className="text-xs text-gray-500 dark:text-gray-400">User Agent</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
                                  {event.userAgent}
                                </dd>
                              </div>
                              {Object.entries(event.metadata).map(([key, value]) => (
                                <div key={key}>
                                  <dt className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers would go here */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentPage}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
