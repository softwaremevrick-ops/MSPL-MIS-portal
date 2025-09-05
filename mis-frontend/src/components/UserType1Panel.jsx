import Layout from '../Layout';
import { Outlet } from 'react-router-dom';

const UserType1Panel = () => {
  return (
    <Layout currentPageName="manager-dashboard">
      <Outlet /> {/* This will render the nested route components */}
    </Layout>
  );
};

export default UserType1Panel;