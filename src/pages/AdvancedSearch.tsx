import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Save, Download, Clock, Calendar, Star, FileText, X, Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Agreement = {
  id: string;
  title: string;
  status: "draft" | "pending" | "signed" | "expired" | "rejected";
  client: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
};

type SavedSearch = {
  id: string;
  name: string;
  query: SearchQuery;
};

type SearchQuery = {
  keyword: string;
  status: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  agreementType: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export default function AdvancedSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [agreementType, setAgreementType] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchResults, setSearchResults] = useState<Agreement[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Recent Pending Agreements",
      query: {
        keyword: "",
        status: ["pending"],
        dateRange: { from: null, to: null },
        agreementType: "",
        sortBy: "updatedAt",
        sortOrder: "desc",
      },
    },
    {
      id: "2",
      name: "All Signed Agreements",
      query: {
        keyword: "",
        status: ["signed"],
        dateRange: { from: null, to: null },
        agreementType: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    },
  ]);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  // Mock data for demonstration
  const mockAgreements: Agreement[] = [
    {
      id: "AGR-001",
      title: "Sales Representative Agreement",
      status: "signed",
      client: "John Smith",
      createdAt: new Date("2025-04-15"),
      updatedAt: new Date("2025-04-20"),
      type: "Employment",
    },
    {
      id: "AGR-002",
      title: "Commission Structure Agreement",
      status: "pending",
      client: "Sarah Johnson",
      createdAt: new Date("2025-04-25"),
      updatedAt: new Date("2025-04-25"),
      type: "Commission",
    },
    {
      id: "AGR-003",
      title: "Territory Assignment Contract",
      status: "draft",
      client: "Michael Brown",
      createdAt: new Date("2025-04-28"),
      updatedAt: new Date("2025-04-29"),
      type: "Territory",
    },
    {
      id: "AGR-004",
      title: "Non-Compete Agreement",
      status: "expired",
      client: "Emily Davis",
      createdAt: new Date("2025-03-10"),
      updatedAt: new Date("2025-03-15"),
      type: "Legal",
    },
    {
      id: "AGR-005",
      title: "Performance Bonus Agreement",
      status: "signed",
      client: "Robert Wilson",
      createdAt: new Date("2025-04-05"),
      updatedAt: new Date("2025-04-10"),
      type: "Compensation",
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Filter the mock data based on search criteria
      let results = [...mockAgreements];
      
      if (keyword) {
        results = results.filter(
          (agreement) =>
            agreement.title.toLowerCase().includes(keyword.toLowerCase()) ||
            agreement.client.toLowerCase().includes(keyword.toLowerCase()) ||
            agreement.id.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      
      if (selectedStatuses.length > 0) {
        results = results.filter((agreement) =>
          selectedStatuses.includes(agreement.status)
        );
      }
      
      if (dateRange.from) {
        results = results.filter(
          (agreement) => agreement.createdAt >= dateRange.from!
        );
      }
      
      if (dateRange.to) {
        results = results.filter(
          (agreement) => agreement.createdAt <= dateRange.to!
        );
      }
      
      if (agreementType) {
        results = results.filter(
          (agreement) => agreement.type === agreementType
        );
      }
      
      // Sort results
      results.sort((a, b) => {
        const aValue = a[sortBy as keyof Agreement];
        const bValue = b[sortBy as keyof Agreement];
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedStatuses([]);
    setDateRange({ from: null, to: null });
    setAgreementType("");
    setSortBy("updatedAt");
    setSortOrder("desc");
    setSearchResults([]);
  };

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) {
      toast.error("Please enter a name for your saved search");
      return;
    }
    
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName,
      query: {
        keyword,
        status: selectedStatuses,
        dateRange,
        agreementType,
        sortBy,
        sortOrder,
      },
    };
    
    setSavedSearches((prev) => [...prev, newSavedSearch]);
    setSaveSearchName("");
    setShowSaveSearch(false);
    toast.success("Search saved successfully");
  };

  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setKeyword(savedSearch.query.keyword);
    setSelectedStatuses(savedSearch.query.status);
    setDateRange(savedSearch.query.dateRange);
    setAgreementType(savedSearch.query.agreementType);
    setSortBy(savedSearch.query.sortBy);
    setSortOrder(savedSearch.query.sortOrder);
    
    // Trigger search with the loaded criteria
    setTimeout(handleSearch, 100);
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id));
    toast.success("Saved search deleted");
  };

  const handleExportResults = () => {
    toast.success("Export started. Your file will be ready shortly.");
    // In a real implementation, this would trigger a file download
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "draft":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "expired":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="keyword">Keyword</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="keyword"
                      placeholder="Search agreements..."
                      className="pl-10"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["draft", "pending", "signed", "expired", "rejected"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => handleStatusToggle(status)}
                        />
                        <Label
                          htmlFor={`status-${status}`}
                          className="capitalize cursor-pointer"
                        >
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="dateFrom" className="text-xs">From</Label>
                      <DatePicker
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateTo" className="text-xs">To</Label>
                      <DatePicker
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="agreementType">Agreement Type</Label>
                  <Select value={agreementType} onValueChange={setAgreementType}>
                    <SelectTrigger id="agreementType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Commission">Commission</SelectItem>
                      <SelectItem value="Territory">Territory</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Compensation">Compensation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sortBy">Sort By</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sortBy">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="updatedAt">Updated Date</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={sortOrder}
                      onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                    >
                      <SelectTrigger id="sortOrder">
                        <SelectValue placeholder="Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSearch} className="flex-1" disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedSearches.length > 0 ? (
                  <div className="space-y-2">
                    {savedSearches.map((savedSearch) => (
                      <div
                        key={savedSearch.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-primary-50 transition-colors"
                      >
                        <button
                          className="text-left flex-1 overflow-hidden"
                          onClick={() => handleLoadSavedSearch(savedSearch)}
                        >
                          <span className="block truncate">{savedSearch.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {savedSearch.query.status.length > 0
                              ? `Status: ${savedSearch.query.status.join(", ")}`
                              : "All statuses"}
                          </span>
                        </button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteSavedSearch(savedSearch.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete saved search</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No saved searches yet
                  </div>
                )}
                
                {showSaveSearch ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter search name"
                      value={saveSearchName}
                      onChange={(e) => setSaveSearchName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveSearch}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowSaveSearch(false);
                          setSaveSearchName("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSaveSearch(true)}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Current Search
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main content with search results */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>
                      {searchResults.length > 0
                        ? `Found ${searchResults.length} agreements matching your criteria`
                        : "Use the filters to search for agreements"}
                    </CardDescription>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <Button variant="outline" onClick={handleExportResults}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Results
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isSearching ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">Searching...</p>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((agreement) => (
                          <TableRow key={agreement.id}>
                            <TableCell className="font-medium">{agreement.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {agreement.title}
                              </div>
                            </TableCell>
                            <TableCell>{agreement.client}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(agreement.status)}>
                                {agreement.status === "signed" && <Check className="mr-1 h-3 w-3" />}
                                {agreement.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                <span className="capitalize">{agreement.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>{agreement.type}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(agreement.createdAt, "MMM d, yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {format(agreement.updatedAt, "MMM d, yyyy")}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your search filters or search for something else
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
