import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { format } from "date-fns";

const statusColors = {
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'Pending': 'bg-orange-100 text-orange-800 border-orange-200',
  'Pending Review': 'bg-blue-100 text-blue-800 border-blue-200',
  'On Hold': 'bg-red-100 text-red-800 border-red-200'
};

// const ProjectActivity = {
//   id: 'number',
//   project_id: 'string',
//   location: 'string',
//   activity_type: 'string',
//   activity_date: 'date',
//   status: 'string',
//   submitted_by: 'string'
// };

export default function RecentActivitiesTable({ activities, isLoading, showActions = true }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800 hover:bg-slate-800">
            <TableHead className="text-white font-semibold">Date</TableHead>
            <TableHead className="text-white font-semibold">Project ID</TableHead>
            <TableHead className="text-white font-semibold">Location</TableHead>
            <TableHead className="text-white font-semibold">Activity Type</TableHead>
            <TableHead className="text-white font-semibold">Status</TableHead>
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
                <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse"></div></TableCell>
              </TableRow>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-gray-50">
                <TableCell>
                  {format(new Date(activity.activity_date), "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="font-medium">{activity.project_id}</TableCell>
                <TableCell>{activity.location}</TableCell>
                <TableCell>{activity.activity_type}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[activity.status]} border font-medium`}>
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No recent activities found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}