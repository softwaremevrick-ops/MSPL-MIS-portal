import  { useState, useEffect } from "react";
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
import Badge from "../components/ui/Badge";
import { Search, Download, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function LocationReport() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredActivities(
        activities.filter(activity =>
          activity.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.project_id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredActivities(activities);
    }
  }, [activities, searchTerm]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectActivity.list('-created_date');
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    setIsLoading(false);
  };

  const getLocationStats = () => {
    const locationStats = {};
    activities.forEach(activity => {
      if (!locationStats[activity.location]) {
        locationStats[activity.location] = {
          total: 0,
          completed: 0,
          pending: 0,
          totalQuantity: 0
        };
      }
      locationStats[activity.location].total++;
      locationStats[activity.location].totalQuantity += activity.quantity_count || 0;
      if (activity.status === 'Completed') {
        locationStats[activity.location].completed++;
      } else {
        locationStats[activity.location].pending++;
      }
    });
    return Object.entries(locationStats).map(([location, stats]) => ({
      location,
      ...stats,
      completionRate: ((stats.completed / stats.total) * 100).toFixed(1)
    }));
  };

  const exportToCSV = () => {
    const headers = ['Location', 'Total Activities', 'Completed', 'Pending', 'Completion Rate', 'Total Quantity'];
    const locationStats = getLocationStats();
    const csvContent = [
      headers.join(','),
      ...locationStats.map(stat => [
        stat.location,
        stat.total,
        stat.completed,
        stat.pending,
        `${stat.completionRate}%`,
        stat.totalQuantity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `location-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">LOCATION-WISE REPORT</h1>
            <p className="text-blue-700 mt-1">Activity breakdown by project locations</p>
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

        {/* Location Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getLocationStats().slice(0, 4).map((stat) => (
            <Card key={stat.location} className="bg-white shadow-lg border-blue-200 border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-2">{stat.location}</p>
                    <p className="text-2xl font-bold text-blue-900">{stat.total}</p>
                    <p className="text-sm text-blue-700">Activities</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{stat.completionRate}%</p>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader className="bg-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Analysis
              </CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by location or project..."
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
                  <TableRow className="bg-blue-50">
                    <TableHead className="text-blue-900 font-semibold">Location</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Total Activities</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Completed</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Pending</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Completion Rate</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Total Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    getLocationStats().map((stat) => (
                      <TableRow key={stat.location} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">{stat.location}</TableCell>
                        <TableCell>{stat.total}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {stat.completed}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            {stat.pending}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${stat.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-900">{stat.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{stat.totalQuantity.toLocaleString()}</TableCell>
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