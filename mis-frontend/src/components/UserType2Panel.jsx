import Layout from '../Layout';
import { Outlet } from 'react-router-dom';

const UserType2Panel = () => {
  return (
    <Layout currentPageName="manpower-dashboard">
      <Outlet /> {/* This will render the nested route components */}
    </Layout>
  );
};

export default UserType2Panel;