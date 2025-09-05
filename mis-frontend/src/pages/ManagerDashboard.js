import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivitiesTable from '../components/dashboard/RecentActivitiesTable';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  // Mock data for manager dashboard
  const metricsData = [
    { title: "Total Projects", value: "50", icon: FileText, iconColor: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { title: "Pending Tasks", value: "120", icon: TrendingUp, iconColor: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { title: "Team Members", value: "15", icon: Users, iconColor: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  ];

  const recentActivities = [
    { id: 1, activityName: "Project Alpha Review", status: "In Progress", date: "2023-10-26" },
    { id: 2, activityName: "Client Meeting - Beta", status: "Completed", date: "2023-10-25" },
    { id: 3, activityName: "Resource Allocation", status: "Pending", date: "2023-10-24" },
    { id: 4, activityName: "System Update Planning", status: "Completed", date: "2023-10-23" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of projects and team activities</p>
          </div>
          <div className="flex gap-3">
            <Link to="/user-type-1/activitysubmission">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Activity
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconColor={metric.iconColor}
              bgColor={metric.bgColor}
              borderColor={metric.borderColor}
            />
          ))}
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-slate-800 text-white">
            <CardTitle>Recent Project Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RecentActivitiesTable activities={recentActivities} isLoading={false} showActions={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
