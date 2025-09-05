import React, { useState, useEffect } from "react";
import ProjectReport from "../components/entities/ProjectReport"; // Temporarily comment out
import Card, { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import { Search, Download, CheckCircle, Users } from "lucide-react";
import { format } from "date-fns";

export default function CustomerAcceptanceReport() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectReport.list('-acceptance_date');
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
    setIsLoading(false);
  };

  const filteredReports = reports.filter(report =>
    !searchTerm || 
    report.project_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAccepted = reports.filter(r => r.status === 'Completed').length;
  const pendingAcceptance = reports.filter(r => r.status !== 'Completed').length;

  const exportToCSV = () => {
    const headers = ['Project ID', 'Submission Date', 'Acceptance Date', 'Status', 'Completion Rate', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        report.project_id,
        format(new Date(report.submission_date), 'yyyy-MM-dd'),
        report.acceptance_date ? format(new Date(report.acceptance_date), 'yyyy-MM-dd') : 'Pending',
        report.status,
        `${report.completion_rate}%`,
        `"${report.remarks || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customer-acceptance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">CUSTOMER ACCEPTANCE REPORT</h1>
            <p className="text-blue-700 mt-1">Track project acceptance and completion status</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">TOTAL ACCEPTED</p>
                  <p className="text-3xl font-bold text-green-600">{totalAccepted.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">PENDING ACCEPTANCE</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingAcceptance.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">ACCEPTANCE RATE</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reports.length > 0 ? ((totalAccepted / reports.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Acceptance Log */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>PROJECT ACCEPTANCE LOG</CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by Month/Year"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-black"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-900 hover:bg-blue-900">
                    <TableHead className="text-white font-semibold">Project ID</TableHead>
                    <TableHead className="text-white font-semibold">Submission Date</TableHead>
                    <TableHead className="text-white font-semibold">Acceptance Date</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold">Completion Rate</TableHead>
                    <TableHead className="text-white font-semibold">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">{report.project_id}</TableCell>
                        <TableCell>
                          {format(new Date(report.submission_date), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>
                          {report.acceptance_date 
                            ? format(new Date(report.acceptance_date), "dd-MM-yyyy")
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === 'Completed' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : report.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${report.completion_rate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{report.completion_rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {report.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}