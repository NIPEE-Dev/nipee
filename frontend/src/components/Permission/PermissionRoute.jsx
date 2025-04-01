import React from 'react';
import withAuth from '../../store/utils/withAuth';
import EmptyResult from '../EmptyResult/EmptyResult';

const PermissionRoute = ({ auth: { permissions }, permission, children }) => {
  if (
    Array.isArray(permission) &&
    permissions.some((p) => permission.indexOf(p) >= 0)
  ) {
    return children;
  }

  if (!permissions.includes(permission)) {
    return <EmptyResult />;
  }

  return children;
};

export default withAuth(PermissionRoute);
