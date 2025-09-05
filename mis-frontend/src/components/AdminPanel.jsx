import Layout from '../Layout';
import { Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <Layout currentPageName="admin-dashboard">
      <Outlet /> {/* This will render the nested route components */}
    </Layout>
  );
};

export default AdminPanel;