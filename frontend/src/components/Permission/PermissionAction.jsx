import React from 'react';
import withAuth from '../../store/utils/withAuth';

const PermissionAction = ({
  auth: { permissions: ownPermissions },
  permission,
  permissions = [],
  children
}) => {
  if (
    permissions.length > 0 &&
    permissions.filter((p) => ownPermissions.includes(p)).length > 0
  ) {
    return children;
  }

  if (!ownPermissions.includes(permission)) {
    return '';
  }

  return children;
};

export default withAuth(PermissionAction);
