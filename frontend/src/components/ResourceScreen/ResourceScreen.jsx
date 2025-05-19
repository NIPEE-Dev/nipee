import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { diff } from 'deep-object-diff';
import _ from 'lodash';
import { Box, Button, Spinner, VStack, HStack, Text, StackDivider, useToast } from '@chakra-ui/react';
import ResourceList from '../ResourceList/ResourceList';
import ResourceNew from '../ResourceNew/ResourceNew';
import Resource from '../Resource/Resource';
import Card from '../Card/Card';
import EmptyResult from '../EmptyResult/EmptyResult';

const ResourceScreen = ({
  resource,
  columns,
  routeBase,
  permissions,
  filters,
  actions,
  Form,
  Details,
  onlyDiff,
  ...props
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Box flex={1} p={4}>
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
              Form={Form}
              typeForm="add"
              {...props.resourceNewProps}
            />
          }
        />
        <Route
          path="view/:id"
          element={<ViewEditContainer
            resource={resource}
            title={props.title}
            Form={Form}
            canEdit={props.canEdit}
            Details={Details || (p => <Form initialValues={p.detailedRecord} {...p} />)}
            routeBase={routeBase}
            onlyDiff={onlyDiff}
          />} />
      </Routes>
    </Box>
  </div>
);

function ViewEditContainer({ resource, title, Form, Details, onlyDiff, routeBase, canEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Resource resource={resource} id={id} redirectAfterSuccess="..">
      {({ isLoading, detailedRecord, update, isSaving }) => {
        if (isLoading) return <Spinner />;
        if (_.isEmpty(detailedRecord)) return <EmptyResult />;
        return (
          <Card p={6}>
            <VStack spacing={4} align="stretch" divider={<StackDivider borderColor="gray.200" />}>
              <HStack justify="space-between">
                <HStack>
                  <Button py={4} onClick={() => navigate('..', { state: { preventReloadList: true } })}>
                    Voltar
                  </Button>
                  <Text fontSize="3xl">{title}</Text>
                </HStack>
                {canEdit && (
                <Button py={4} colorScheme="blue"
                onClick={() => setIsEditing(e => !e)}>
                  {isEditing ? 'Visualizar' : 'Editar'}
                </Button>
                )}
              </HStack>

      {isEditing ? (
        <Form
          initialValues={detailedRecord}
          initialErrors={{}}
          onSubmit={async (values) => {
            const result = await update(id, onlyDiff ? diff(detailedRecord, values) : values);
            setIsEditing(false);
            navigate('..', { state: { preventReloadList: true } });
              toast({
                title: 'Sucesso!',
                description: 'Dados atualizados com sucesso',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
                variant: 'left-accent',
              });
          }}
          isLoading={isSaving}
        >
                  <Box py={3} textAlign='right'>
                    <Button mt='3' colorScheme='blue' type='submit' isLoading={isLoading}>
                      Salvar
                    </Button>
                  </Box>
                </Form>
              ) : (
                <Details detailedRecord={detailedRecord} readOnly typeForm="view" />
              )}
            </VStack>
          </Card>
        );
      }}
    </Resource>
  );
}

ResourceScreen.defaultProps = {
  canList: true,
  canAdd: true,
  canEdit: true,
  canView: true,
  canRemove: true,
  resourceListProps: {},
  resourceNewProps: {},
  onlyDiff: true,
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
  onlyDiff: PropTypes.bool,
  Form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  Details: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default ResourceScreen;
