import { useState, useEffect } from "react";
import ProjectActivity from "../components/entities/ProjectActivity";
import Card from "../components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Search, Download, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

export default function DailyProcessReport() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectActivity.list('-activity_date');
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    setIsLoading(false);
  };

  const getDailyBreakdown = () => {
    const dailyStats = {};
    activities.forEach(activity => {
      const date = format(new Date(activity.activity_date), 'yyyy-MM-dd');
      if (!dailyStats[date]) {
        dailyStats[date] = {
          totalManpower: 0,
          avgUtilization: 0,
          hoursSpent: 0,
          utilizationPercentage: 0,
          activitiesCount: 0
        };
      }
      dailyStats[date].activitiesCount++;
      dailyStats[date].totalManpower += Math.floor(Math.random() * 50) + 100; // Simulated data
      dailyStats[date].avgUtilization += Math.floor(Math.random() * 40) + 60;
      dailyStats[date].hoursSpent += Math.floor(Math.random() * 20) + 10;
    });

    // Calculate averages
    Object.keys(dailyStats).forEach(date => {
      const stats = dailyStats[date];
      stats.avgUtilization = (stats.avgUtilization / stats.activitiesCount).toFixed(1);
      stats.utilizationPercentage = (Math.random() * 30 + 60).toFixed(1);
    });

    return Object.entries(dailyStats)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .slice(0, 15);
  };

  const filteredData = getDailyBreakdown().filter(([date]) =>
    date.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = ['Date', 'Total Manpower Available', 'Average Daily Utilization', 'Hours Spent', '% Utilization', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(([date, stats]) => [
        date,
        stats.totalManpower,
        stats.avgUtilization,
        stats.hoursSpent,
        `${stats.utilizationPercentage}%`,
        stats.utilizationPercentage > 80 ? 'Excellent' : stats.utilizationPercentage > 60 ? 'Good' : 'Needs Improvement'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `daily-process-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">DAILY PROCESS-WISE REPORT</h1>
            <p className="text-blue-700 mt-1">Daily manpower utilization and performance metrics</p>
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
                <Calendar className="w-5 h-5" />
                DAILY PROGRESS BREAKDOWN
              </CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by Date Range"
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
                    <TableHead className="text-white font-semibold">Date</TableHead>
                    <TableHead className="text-white font-semibold">Total Manpower Available</TableHead>
                    <TableHead className="text-white font-semibold">Average Daily Utilization</TableHead>
                    <TableHead className="text-white font-semibold">Hours Spent</TableHead>
                    <TableHead className="text-white font-semibold">% Utilization</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(10).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredData.map(([date, stats]) => (
                      <TableRow key={date} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">
                          {format(new Date(date), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>{stats.totalManpower}</TableCell>
                        <TableCell>{stats.avgUtilization}%</TableCell>
                        <TableCell>{stats.hoursSpent}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${stats.utilizationPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{stats.utilizationPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            stats.utilizationPercentage > 80 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : stats.utilizationPercentage > 60
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }>
                            {stats.utilizationPercentage > 80 ? 'Excellent' : 
                             stats.utilizationPercentage > 60 ? 'Good' : 'Needs Improvement'}
                          </Badge>
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
