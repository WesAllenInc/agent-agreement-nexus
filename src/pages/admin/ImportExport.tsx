import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  X,
  Info
} from 'lucide-react';
import { t } from '../../utils/i18n';

interface ImportStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
  errors?: string[];
  totalRecords?: number;
  successRecords?: number;
  errorRecords?: number;
}

export default function ImportExport() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importType, setImportType] = useState<'agreements' | 'users'>('agreements');
  const [exportType, setExportType] = useState<'agreements' | 'users' | 'audit-log'>('agreements');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [includeFields, setIncludeFields] = useState({
    agreements: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      signedAt: true,
      expiresAt: true,
      signers: true,
      metadata: false,
    },
    users: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      status: true,
      company: true,
      metadata: false,
    },
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportStatus({
        status: 'idle',
        progress: 0,
        message: '',
      });
    }
  };
  
  const handleImport = () => {
    if (!importFile) return;
    
    // Simulate import process
    setImportStatus({
      status: 'uploading',
      progress: 0,
      message: 'Uploading file...',
    });
    
    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setImportStatus(prev => ({
        ...prev,
        progress,
      }));
      
      if (progress >= 100) {
        clearInterval(uploadInterval);
        setImportStatus({
          status: 'processing',
          progress: 100,
          message: 'Processing data...',
        });
        
        // Simulate processing delay
        setTimeout(() => {
          // Randomly succeed or fail for demo purposes
          const success = Math.random() > 0.3;
          
          if (success) {
            setImportStatus({
              status: 'success',
              progress: 100,
              message: 'Import completed successfully!',
              totalRecords: 120,
              successRecords: 118,
              errorRecords: 2,
              errors: [
                'Row 45: Invalid email format',
                'Row 87: Missing required field "name"',
              ],
            });
          } else {
            setImportStatus({
              status: 'error',
              progress: 100,
              message: 'Import failed. Please check the errors and try again.',
              errors: [
                'Invalid file format. Please use CSV or JSON.',
                'Column "status" is missing in the file.',
              ],
            });
          }
        }, 2000);
      }
    }, 300);
  };
  
  const handleExport = () => {
    // In a real app, would call API to export data
    console.log('Exporting', {
      type: exportType,
      format: exportFormat,
      dateRange,
      includeFields: includeFields[exportType === 'audit-log' ? 'agreements' : exportType],
    });
    
    // Simulate export
    alert(`Exporting ${exportType} as ${exportFormat}...`);
  };
  
  const handleToggleField = (type: 'agreements' | 'users', field: string) => {
    setIncludeFields(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: !prev[type][field as keyof (typeof prev)[typeof type]],
      },
    }));
  };
  
  const handleSelectAllFields = (type: 'agreements' | 'users', value: boolean) => {
    setIncludeFields(prev => ({
      ...prev,
      [type]: Object.keys(prev[type]).reduce((acc, field) => {
        acc[field as keyof (typeof prev)[typeof type]] = value;
        return acc;
      }, { ...prev[type] }),
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              activeTab === 'import'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('import')}
          >
            <div className="flex items-center justify-center">
              <Upload size={16} className="mr-2" />
              Import Data
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              activeTab === 'export'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('export')}
          >
            <div className="flex items-center justify-center">
              <Download size={16} className="mr-2" />
              Export Data
            </div>
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'import' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Import Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={importType === 'agreements'}
                          onChange={() => setImportType('agreements')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Agreements</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={importType === 'users'}
                          onChange={() => setImportType('users')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Users</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Upload
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".csv,.json"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          CSV or JSON up to 10MB
                        </p>
                        {importFile && (
                          <div className="flex items-center justify-center text-sm text-gray-800 dark:text-gray-200 mt-2">
                            <FileText size={16} className="mr-1" />
                            {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {importFile && importStatus.status === 'idle' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {importType === 'agreements' ? (
                              'Make sure your CSV has columns for title, status, and dates.'
                            ) : (
                              'Make sure your CSV has columns for name, email, and role.'
                            )}
                          </p>
                          <p className="mt-3 text-sm md:mt-0 md:ml-6">
                            <a
                              href="#"
                              className="whitespace-nowrap font-medium text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
                            >
                              View template
                              <span aria-hidden="true"> &rarr;</span>
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {importStatus.status !== 'idle' && (
                    <div className={`rounded-md p-4 ${
                      importStatus.status === 'error' 
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                        : importStatus.status === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    }`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {importStatus.status === 'error' ? (
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                          ) : importStatus.status === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className={`text-sm font-medium ${
                            importStatus.status === 'error'
                              ? 'text-red-800 dark:text-red-300'
                              : importStatus.status === 'success'
                              ? 'text-green-800 dark:text-green-300'
                              : 'text-blue-800 dark:text-blue-300'
                          }`}>
                            {importStatus.message}
                          </h3>
                          
                          {(importStatus.status === 'uploading' || importStatus.status === 'processing') && (
                            <div className="mt-2">
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200 dark:bg-blue-800">
                                  <div
                                    style={{ width: `${importStatus.progress}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {importStatus.status === 'success' && importStatus.totalRecords && (
                            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                              <p>Successfully imported {importStatus.successRecords} of {importStatus.totalRecords} records.</p>
                              {importStatus.errorRecords && importStatus.errorRecords > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium">Errors ({importStatus.errorRecords}):</p>
                                  <ul className="mt-1 list-disc list-inside text-xs">
                                    {importStatus.errors?.map((error, index) => (
                                      <li key={index}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {importStatus.status === 'error' && importStatus.errors && (
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                              <ul className="list-disc list-inside">
                                {importStatus.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    {importStatus.status === 'success' || importStatus.status === 'error' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setImportFile(null);
                          setImportStatus({
                            status: 'idle',
                            progress: 0,
                            message: '',
                          });
                        }}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start New Import
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleImport}
                        disabled={!importFile || importStatus.status !== 'idle'}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          !importFile || importStatus.status !== 'idle'
                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        {importStatus.status === 'idle' ? 'Start Import' : 'Importing...'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Export Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={exportType === 'agreements'}
                          onChange={() => setExportType('agreements')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Agreements</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={exportType === 'users'}
                          onChange={() => setExportType('users')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Users</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={exportType === 'audit-log'}
                          onChange={() => setExportType('audit-log')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Audit Log</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Export Format
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={exportFormat === 'csv'}
                          onChange={() => setExportFormat('csv')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">CSV</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={exportFormat === 'json'}
                          onChange={() => setExportFormat('json')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">JSON</span>
                      </label>
                      {exportType === 'agreements' && (
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            checked={exportFormat === 'pdf'}
                            onChange={() => setExportFormat('pdf')}
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">PDF</span>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date Range (From)
                      </label>
                      <input
                        type="date"
                        id="date-from"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date Range (To)
                      </label>
                      <input
                        type="date"
                        id="date-to"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Include Fields
                      </label>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllFields(exportType === 'audit-log' ? 'agreements' : exportType, true)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectAllFields(exportType === 'audit-log' ? 'agreements' : exportType, false)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {exportType !== 'users' ? (
                          // Agreement fields
                          Object.keys(includeFields.agreements).map(field => (
                            <label key={field} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600"
                                checked={includeFields.agreements[field as keyof typeof includeFields.agreements]}
                                onChange={() => handleToggleField('agreements', field)}
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))
                        ) : (
                          // User fields
                          Object.keys(includeFields.users).map(field => (
                            <label key={field} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600"
                                checked={includeFields.users[field as keyof typeof includeFields.users]}
                                onChange={() => handleToggleField('users', field)}
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleExport}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
