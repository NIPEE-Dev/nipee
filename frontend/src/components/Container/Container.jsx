import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Center, Spinner } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  isPinging,
  isAuthenticated,
  handlePing,
  handleLogout,
  syncPermissions
} from '../../store/ducks/auth';
import SidebarWithHeader from '../SidebarWithHeader/SidebarWithHeader';
import routes from '../../routes';

const Container = ({
  isPinging,
  isAuthenticated,
  handlePing,
  handleLogout,
  syncPermissions
}) => {
  useEffect(() => {
    handlePing();
    syncPermissions();
  }, []);

  if (isPinging) {
    return (
      <Center h='100vh' w='100vw'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login} replace />;
  }

  return (
    <SidebarWithHeader handleLogout={handleLogout}>
      <Outlet />
    </SidebarWithHeader>
  );
};

const mapStateToProps = (state) => ({
  isPinging: isPinging(state),
  isAuthenticated: isAuthenticated(state)
});

export default connect(mapStateToProps, {
  handlePing,
  handleLogout,
  syncPermissions
})(Container);
