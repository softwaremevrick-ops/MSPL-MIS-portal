import React, { useState, useEffect } from "react";
import ProjectReport from "../components/entities/ProjectReport";
import ProjectActivity from "../components/entities/ProjectActivity";
import Card, { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, TrendingUp, BarChart3 } from "lucide-react";

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function PowerBIReport() {
  const [reports, setReports] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const reportsData = await ProjectReport.list('-created_date');
      const activitiesData = await ProjectActivity.list('-created_date');
      setReports(reportsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Calculate completion rates
  const completionData = [
    { name: 'Project 1', rate: 78 },
    { name: 'Project 2', rate: 92 }
  ];

  // Monthly performance trend
  const monthlyData = [
    { month: 'Jan', completed: 85, inProgress: 120, onHold: 25 },
    { month: 'Feb', completed: 120, inProgress: 95, onHold: 15 },
    { month: 'Mar', completed: 140, inProgress: 110, onHold: 20 },
    { month: 'Apr', completed: 160, inProgress: 85, onHold: 10 },
    { month: 'May', completed: 145, inProgress: 100, onHold: 18 },
    { month: 'Jun', completed: 170, inProgress: 75, onHold: 12 }
  ];

  // Activity type distribution
  const activityTypeData = activities.reduce((acc, activity) => {
    acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(activityTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen print:bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">POWER BI REPORT</h1>
            <p className="text-blue-700 mt-1">Comprehensive project analytics and insights</p>
          </div>
          <Button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 print:hidden"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>

        {/* Project Completion Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-800 text-white">
              <CardTitle>Project Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center gap-12">
                {completionData.map((project, index) => (
                  <div key={project.name} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke={index === 0 ? "#3b82f6" : "#10b981"}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(project.rate / 100) * 314} 314`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-900">{project.rate}%</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-blue-900">{project.name}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-800 text-white">
              <CardTitle>Activity Type Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Project Status Overview & Monthly Performance Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-800 text-white">
              <CardTitle>Project Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData.slice(-3)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                  <Bar dataKey="onHold" fill="#ef4444" name="On Hold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-800 text-white">
              <CardTitle>Monthly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inProgress" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="In Progress"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="onHold" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="On Hold"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Document Processing Statistics */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle>SCANNED REPORT OF LAST 30 DAYS</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">1,242,547</div>
                <div className="text-sm text-blue-700">Received</div>
                <div className="text-xs text-gray-500">Files: 5,990,40,1907</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">2,488,754</div>
                <div className="text-sm text-blue-700">Scanned</div>
                <div className="text-xs text-gray-500">Images: 5,99,40,194</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">2,86,423</div>
                <div className="text-sm text-blue-700">Image QC</div>
                <div className="text-xs text-gray-500">Images: 4,13,6,60,382</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">2,87,117</div>
                <div className="text-sm text-blue-700">DMS</div>
                <div className="text-xs text-gray-500">Images: 5,06,6,40,390</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">1,32,19,210</div>
                <div className="text-sm text-blue-700">Returned</div>
                <div className="text-xs text-gray-500">Images: 37,000</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}