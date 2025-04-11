import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from 'react-router-dom';
import ResourceList from '../ResourceList/ResourceList';
import ResourceDetails from '../ResourceDetails/ResourceDetails';
import ResourceNew from '../ResourceNew/ResourceNew';
import ResourceUpdate from '../ResourceUpdate/ResourceUpdate';
import Footer from '../Footer/Footer';

const ResourceScreen = ({
  resource,
  columns,
  routeBase,
  permissions,
  filters,
  actions,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <div style={{ flex: 1 }}>
      <Routes>
        <Route
          index
          element={
            <ResourceList
              title={props.title}
              canList={props.canList}
              canAdd={props.canAdd}
              canEdit={props.canEdit}
              canView={props.canView}
              canRemove={props.canRemove}
              resource={resource}
              routeBase={routeBase}
              columns={columns}
              filters={filters}
              actions={actions}
              autoFetch
              {...props.resourceListProps}
            />
          }
        />
        <Route
          path="add"
          element={
            <ResourceNew
              resource={resource}
              routeBase={routeBase}
              Form={props.Form}
              typeForm="add"
              {...props.resourceNewProps}
            />
          }
        />
        <Route
          path="view/:id"
          element={
            <ResourceDetails
              title="Visualização"
              resource={resource}
              routeBase={routeBase}
              Details={
                props.Details ||
                ((p) => <props.Form initialValues={p.detailedRecord} {...p} />)
              }
              typeForm="view"
              readOnly
              {...props.resourceDetailsProps}
            />
          }
        />
        <Route
          path="edit/:id"
          element={
            <ResourceUpdate
              resource={resource}
              title="Edição"
              routeBase={routeBase}
              Form={
                props.Edit ||
                ((p) => <props.Form initialValues={p.detailedRecord} {...p} />)
              }
              typeForm="edit"
              resourceUpdateProps={props.resourceUpdateProps}
            />
          }
        />
      </Routes>
    </div>
    <Footer bg="none" border="none" style={{ marginBottom: -10 }}/>
  </div>
);

ResourceScreen.defaultProps = {
  canList: true,
  canAdd: true,
  canEdit: true,
  canView: true,
  canRemove: true,
  resourceListProps: {},
  resourceNewProps: {},
  resourceDetailsProps: {},
  resourceUpdateProps: {
    onlyDiff: true,
  },
  actions: () => null,
};

ResourceScreen.propTypes = {
  resource: PropTypes.string.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  canList: PropTypes.bool,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canView: PropTypes.bool,
  canRemove: PropTypes.bool,
  resourceListProps: PropTypes.object,
  resourceNewProps: PropTypes.object,
  resourceDetailsProps: PropTypes.object,
  resourceUpdateProps: PropTypes.object,
};

export default ResourceScreen;
