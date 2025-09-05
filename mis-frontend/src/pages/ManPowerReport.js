import { useState, useEffect } from "react";
import ProjectActivity from "../components/entities/ProjectActivity";
import Card from "../components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Table from "../components/ui/Table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Search, Download, Users } from "lucide-react";
import { format } from "date-fns";

export default function ManPowerReport() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectActivity.list('-created_date');
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
    setIsLoading(false);
  };

  const filteredReports = reports.filter(report =>
    !searchTerm || 
    report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(report.submission_date), 'MMM yyyy').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Month', 'Total Manpower Available', 'Average Daily Utilization', '% Utilization', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        format(new Date(report.submission_date), 'MMM-yyyy'),
        report.total_manpower,
        report.utilization_percentage?.toFixed(2),
        `${((report.utilization_percentage / report.total_manpower) * 100).toFixed(1)}%`,
        `"${report.remarks || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `manpower-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">MAN POWER REPORT</h1>
            <p className="text-blue-700 mt-1">Manpower utilization and monthly performance analysis</p>
          </div>
          <Button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                MAN POWER UTILIZATION - MONTHLY AVERAGE
              </CardTitle>
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
                    <TableHead className="text-white font-semibold">Month</TableHead>
                    <TableHead className="text-white font-semibold">Total Manpower Available</TableHead>
                    <TableHead className="text-white font-semibold">Average Daily Utilization</TableHead>
                    <TableHead className="text-white font-semibold">% Utilization</TableHead>
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
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">
                          {format(new Date(report.submission_date), "MMM-yyyy")}
                        </TableCell>
                        <TableCell>{report.total_manpower}</TableCell>
                        <TableCell>{report.utilization_percentage?.toFixed(2)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${((report.utilization_percentage / report.total_manpower) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {((report.utilization_percentage / report.total_manpower) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {report.remarks || 'Good performance'}
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