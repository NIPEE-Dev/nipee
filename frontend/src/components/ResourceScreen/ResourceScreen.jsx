import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { diff } from 'deep-object-diff';
import _ from 'lodash';
import { Box, Button, Spinner, VStack, HStack, Text, StackDivider, useToast, Tooltip } from '@chakra-ui/react';
import ResourceList from '../ResourceList/ResourceList';
import ResourceNew from '../ResourceNew/ResourceNew';
import Resource from '../Resource/Resource';
import Card from '../Card/Card';
import EmptyResult from '../EmptyResult/EmptyResult';
import { MdKeyboardBackspace } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { ModalConfirm } from '../WithModal/ModalConfirm';
import { WithModal } from '../WithModal';

const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";
  const isAdm = userRole === "Administrador Geral";

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
            <Box>
              <ResourceNew
                resource={resource}
                routeBase={routeBase}
                Form={Form}
                typeForm="add"
                {...props.resourceNewProps}
              />
            </Box>
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
            canRemove={props.canRemove}
          />} />
      </Routes>
    </Box>
  </div>
);

function ViewEditContainer({ resource, title, Form, Details, onlyDiff, routeBase, canEdit, canRemove }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Resource resource={resource} id={id} redirectAfterSuccess="..">
      {({ isLoading, detailedRecord, update, isSaving, remove }) => {
        if (isLoading) return <Spinner />;
        if (_.isEmpty(detailedRecord)) return <EmptyResult />;
        return (
          <Card p={6}>
            <VStack spacing={4} align="stretch" divider={<StackDivider borderColor="gray.200" />}>
              <HStack justify="space-between">
          <HStack>
            {!title.localeCompare("Meu Registo", undefined, { sensitivity: "base" }) === 0 && (
            <Tooltip hasArrow label='Voltar'>
              <Box as="span" tabIndex={0}>
                <MdKeyboardBackspace
            size={24}
            cursor='pointer'
            onClick={() => navigate(-1)}
                />
              </Box>
            </Tooltip>)}
            <Text fontSize="3xl">{title}</Text>
          </HStack>
          <HStack spacing={2}>
            {canEdit && (
              <Button py={4} colorScheme="blue"
                onClick={() => setIsEditing(e => !e)}>
                {isEditing ? 'Visualizar' : 'Editar'}
              </Button>
            )}
            {canRemove && (
              <Tooltip hasArrow label='Excluir'>
                <WithModal
            modal={({ closeModal }) => (
              <ModalConfirm
                onConfirm={() => {
                  remove(id).then(() => {
              toast({
                title: 'Sucesso!',
                description: `Registo apagado com sucesso!`,
                variant: 'left-accent',
                duration: 5000,
                status: 'success',
                isClosable: true,
                position: 'top-right'
              });
              closeModal();
              navigate(-1);
                  });
                }}
                onCancel={closeModal}
              />
            )}
                >
            {({ toggleModal }) => (
              <Tooltip hasArrow label='Excluir'>
                <Button colorScheme='red' onClick={toggleModal}>
                  <FaTrashAlt size={24} cursor='pointer' />
                </Button>
              </Tooltip>
            )}
                </WithModal>
              </Tooltip>
            )}
          </HStack>
              </HStack>

              {isEditing ? (
         <Form
  initialValues={detailedRecord}
  initialErrors={{}}
  onSubmit={async (values) => {
    try {
      const result = await update(id, onlyDiff ? diff(detailedRecord, values) : values);
      setIsEditing(false);
      navigate('..');
      toast({
        title: 'Sucesso!',
        description: 'Dados atualizados com sucesso!',
        status: 'success',
        isClosable: true,
        position: 'top-right',
        variant: 'left-accent',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: error?.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
        variant: 'left-accent',
      });
    }
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
