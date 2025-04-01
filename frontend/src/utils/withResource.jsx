import React from 'react';
import Resource from '../components/Resource/Resource';
import resolve from './resolve';

export default (WrappedComponent, receivedProps) =>
  class extends React.Component {
    render() {
      const propsForResource = resolve(receivedProps, this.props);
      return (
        <Resource {...propsForResource}>
          {(resourceProps) => (
            <WrappedComponent {...this.props} resourceProps={resourceProps} />
          )}
        </Resource>
      );
    }
  };
