import React, { useState } from 'react';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import routes from '../../routes';
import { Text, Button, Tooltip, useToast, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { FaBan, FaCheck } from 'react-icons/fa';
import useStudentPreRegistrations from '../../hooks/useStudentPreRegistrations';
import { WorkflowCandidatesForm as Form } from '../../forms/WorkflowCandidatesForm/WorkflowCandidatesForm';
import { WithModal } from '../../components/WithModal';

const WorkflowCandidatesPage = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isAdm = userRole === "Administrador Geral";

  const { approveStudentPreRegistration, rejectStudentPreRegistration, loading } = useStudentPreRegistrations();
  const toast = useToast();



  const handleApprove = async (id) => {
    try {
      const result = await approveStudentPreRegistration(id);
      toast({
        title: 'Candidato aprovado!',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro ao aprovar o Candidato.',
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
      const result = await rejectStudentPreRegistration(id, reason);
      toast({
        title: 'Candidato rejeitado!',
        description: result.data?.message || 'O candidato foi rejeitado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      closeModal(); 
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro ao rejeitar o candidato.',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ResourceScreen
      title="Pré-Registos Candidatos"
      permissions={['']}
      resource="WorkflowCandidates"
      Form={Form}
      routeBase={routes.workflow.candidatos}
      canRemove={isAdm}
      canAdd={false}
      canEdit={false}
      canRemove={isAdm}
      actions={({ id }) => (
        <>
          <Tooltip label="Aprovar Candidato" hasArrow>
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
              <Tooltip label="Rejeitar Candidato" hasArrow>
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
          Header: 'Nome do Candidato',
          accessor: 'full_name',
        },
        {
          Header: 'Nível de Ensino',
          accessor: 'education_level',
          Cell: ({ value }) => {
            let levelText;
        
            switch (value) {
              case 'E':
                levelText = 'Cursos Profissionais Nível 4 / Ensino Secundário';
                break;
              case 'CP5':
                levelText = 'Cursos Profissionais CET - Nível 5';
                break;
              case 'TS':
                levelText = 'Ensino Superior TESP - Nível 5';
                break;
                case 'CP4':
                levelText = 'Cursos Profissionais nível 4';
                break;
                case 'TESP':
                levelText = 'TESP nível 5';
                break;
              default:
                levelText = 'Nível de Ensino Desconhecido';
            }
        
            return <Text>{levelText}</Text>;
          },
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
        {
          Header: 'Nome da Escola',
          accessor: 'school.fantasy_name',
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
          field: 'full_name',
          header: 'Nome do Candidato',
        },
      ]}
    />
  );
};

export default WorkflowCandidatesPage;
