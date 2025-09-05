import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import UserType1Panel from './components/UserType1Panel';
import UserType2Panel from './components/UserType2Panel';
import SignIn from './components/SignIn';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Importing all the page components for nested routes
import AdminDashboard from './pages/AdminDashboard';
import LocationReport from './pages/LocationReport';
import LastReportUpdate from './pages/LastReportUpdate';
import ManpowerReport from './pages/ManPowerReport';
import DailyProcessReport from './pages/DailyProcessReport';
import CustomerAcceptanceReport from './pages/CustomeAcceptanceReport';
import PowerBIReport from './pages/PowerBIReport';
import InventoryControl from './pages/InventoryControl';
import ManageActivities from './components/ManagerPanelComponents/ManageActivities';
import ActivitySubmission from './components/ManpowerPanelComponents/DailyActivitySubmission';
import MySubmissions from './components/ManpowerPanelComponents/MySubmissions';
import Help from './pages/Help';
import ManagerDashboard from './pages/ManagerDashboard';
import ManpowerDashboard from './pages/ManpowerDashboard';

// Role-based route protection
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<SignIn />} />
        
        {/* Admin Panel Nested Routes */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* Default route for /admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="locationreport" element={<LocationReport />} />
          <Route path="lastreportupdate" element={<LastReportUpdate />} />
          <Route path="manpowerreport" element={<ManpowerReport />} />
          <Route path="dailyprocessreport" element={<DailyProcessReport />} />
          <Route path="customeracceptancereport" element={<CustomerAcceptanceReport />} />
          <Route path="powerbireport" element={<PowerBIReport />} />
          <Route path="inventorycontrol" element={<InventoryControl />} />
        </Route>

        {/* Manager Panel Nested Routes (UserType1Panel) */}
        <Route
          path="/user-type-1"
          element={
            <ProtectedRoute allowedRoles={['userType1', 'admin']}>
              <UserType1Panel />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} /> {/* Default route for /user-type-1 */}
          <Route path="manpowerdashboard" element={<ManagerDashboard />} />
          <Route path="activitysubmission" element={<ManageActivities />} /> {/* Use ManageActivities for Manager */}
          <Route path="inventorycontrol" element={<InventoryControl />} /> {/* Update Data for Manager */}
        </Route>

        {/* Manpower Panel Nested Routes (UserType2Panel) */}
        <Route
          path="/user-type-2"
          element={
            <ProtectedRoute allowedRoles={['userType2', 'userType1', 'admin']}>
              <UserType2Panel />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManpowerDashboard />} /> {/* Default route for /user-type-2 */}
          <Route path="manpowerdashboard" element={<ManpowerDashboard />} />
          <Route path="activitysubmission" element={<ActivitySubmission />} />
          <Route path="mysubmissions" element={<MySubmissions />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;