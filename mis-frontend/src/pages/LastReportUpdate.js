import { useState, useEffect } from "react";
import ProjectActivity from "../components/entities/ProjectActivity";
import Card from "../components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Clock, Calendar, Filter, Download } from "lucide-react";
import { format, isToday, isYesterday, subDays } from "date-fns";

export default function LastReportUpdate() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectActivity.list('-updated_date', 50);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    setIsLoading(false);
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const groupActivitiesByDate = () => {
    const grouped = {};
    activities.forEach(activity => {
      const date = format(new Date(activity.updated_date), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  const exportToCSV = () => {
    const headers = ['Project ID', 'Location', 'Activity Type', 'Status', 'Last Updated', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...activities.map(activity => [
        activity.project_id,
        activity.location,
        activity.activity_type,
        activity.status,
        format(new Date(activity.updated_date), 'yyyy-MM-dd HH:mm'),
        `"${activity.remarks || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `last-report-updates-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedActivities = groupActivitiesByDate();

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">LAST REPORT UPDATE</h1>
            <p className="text-blue-700 mt-1">Recent Activities & Submissions</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Date
            </Button>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <Card key={date} className="shadow-lg border-0">
              <CardHeader className="bg-blue-800 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {getDateLabel(date)} - {dayActivities.length} Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayActivities.map((activity) => (
                    <Card key={activity.id} className="border border-blue-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-blue-900">{activity.project_id}</h4>
                            <Badge className={
                              activity.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : activity.status === 'Pending'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-blue-900">{activity.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{activity.activity_type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">{activity.quantity_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Updated:</span>
                              <span className="text-xs">{format(new Date(activity.updated_date), "HH:mm")}</span>
                            </div>
                          </div>

                          {activity.remarks && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
                              {activity.remarks}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedActivities).length === 0 && !isLoading && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Updates</h3>
                <p className="text-gray-500">No activities have been updated recently</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}