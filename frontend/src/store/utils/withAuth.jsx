import React from 'react';
import Auth from './Auth';

export default function withAuth(Component) {
  return (ownerProps) => (
    <Auth>{(props) => <Component auth={props} {...ownerProps} />}</Auth>
  );
}
