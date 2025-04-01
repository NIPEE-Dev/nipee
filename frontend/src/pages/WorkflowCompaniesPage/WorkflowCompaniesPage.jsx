import React, { useState } from 'react';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import routes from '../../routes';
import { Text, Button, Tooltip, useToast, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { FaBan, FaCheck } from 'react-icons/fa';
import useCompanyPreRegistrations from '../../hooks/useCompanyPreRegistrations';
import { WorkflowCompaniesForm as Form } from '../../forms/WorkflowCompaniesForm/WorkflowCompaniesForm';
import { WithModal } from '../../components/WithModal';

const WorkflowCompaniesPage = () => {
  const { approveCompanyPreRegistration, rejectCompanyPreRegistration, loading } = useCompanyPreRegistrations();
  const toast = useToast();

  const handleApprove = async (id) => {
    try {
      const result = await approveCompanyPreRegistration(id);
      toast({
        title: 'Empresa aprovada!',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro ao aprovar a empresa.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (id, reason, closeModal) => {
    if (!reason.trim()) {
      toast({
        title: 'Erro.',
        description: 'O motivo da rejeição é obrigatório.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const result = await rejectCompanyPreRegistration(id, reason);
      toast({
        title: 'Empresa rejeitada!',
        description: result.data?.message || 'A empresa foi rejeitada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      closeModal(); 
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro ao rejeitar a empresa.',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ResourceScreen
      title="Listagem de Pré-Registos Empresas"
      permissions={['']}
      resource="WorkflowCompanies"
      Form={Form}
      routeBase={routes.workflow.empresas}
      canRemove={false}
      canAdd={false}
      canEdit={false}
      actions={({ id }) => (
        <>
          <Tooltip label="Aprovar Empresa" hasArrow>
            <Button
              size="xs"
              colorScheme="green"
              onClick={() => handleApprove(id)}
              isLoading={loading}
            >
              <FaCheck />
            </Button>
          </Tooltip>

          <WithModal
            modal={({ closeModal }) => {
              const [reason, setReason] = useState(''); 

              return (
                <FormControl>
                  <FormLabel>Motivo da Rejeição</FormLabel>
                  <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Informe o motivo"
                  />
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      handleReject(id, reason, closeModal); 
                    }}
                    isLoading={loading}
                    mt={4}
                  >
                    Rejeitar
                  </Button>
                </FormControl>
              );
            }}
          >
            {({ toggleModal }) => (
              <Tooltip label="Rejeitar Empresa" hasArrow>
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={toggleModal}
                  isLoading={loading}
                >
                  <FaBan />
                </Button>
              </Tooltip>
            )}
          </WithModal>

        </>
      )}
      columns={[
        {
          Header: 'Nome da Empresa',
          accessor: 'company_name',
        },
        {
          Header: 'Setor',
          accessor: 'sector',
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ value }) => {
            let color;

            switch (value) {
              case 'Aprovado':
                color = 'green.600';
                break;
              case 'Pendente':
                color = 'yellow.600';
                break;
              case 'Rejeitado':
                color = 'red.600';
                break;
              default:
                color = 'gray.600';
            }

            return (
              <Text color={color} fontWeight="bold">
                {value}
              </Text>
            );
          },
        },
        {
          Header: 'Data de envio',
          accessor: 'created_at',
          Cell: ({ value }) =>
            value ? format(new Date(value), 'dd/MM/yyyy', { locale: pt }) : '-',
        },
        {
          Header: 'Data da Aprovação',
          accessor: 'approved_at',
          Cell: ({ value }) =>
            value ? format(new Date(value), 'dd/MM/yyyy', { locale: pt }) : '-',
        },
        {
          Header: 'Data da Rejeição',
          accessor: 'reject_at',
          Cell: ({ value }) =>
            value ? format(new Date(value), 'dd/MM/yyyy', { locale: pt }) : '-',
        },
        {
          Header: 'Motivo da Rejeição',
          accessor: 'rejection_reason',
        },
      ]}
      filters={[
        {
          field: 'status',
          header: 'Status',
          type: 'select',
          options: [
            { value: 'Aprovado', header: 'Aprovado' },
            { value: 'Pendente', header: 'Pendente' },
            { value: 'Rejeitado', header: 'Rejeitado' },
          ],
        },
        {
          field: 'company_name',
          header: 'Nome da empresa',
        },
      ]}
    />
  );
};

export default WorkflowCompaniesPage;
