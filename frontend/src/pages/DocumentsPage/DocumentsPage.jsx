import React from 'react';
import { HStack, Link, Tag, TagLabel, TagLeftIcon, Button } from '@chakra-ui/react';
import {
  MdUploadFile,
  MdDriveFileMoveOutline,
  MdOutlineDriveFileMoveRtl,
  MdOutlineOpenInNew,
  MdEdit 
} from 'react-icons/md';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import routes from '../../routes';
import { dateFormatter } from '../../utils/visualization';
import getRoute from '../../utils/getRoute';
import WithModal from '../../components/WithModal/WithModal';
import SignaturePad from '../../components/SignaturePad/SignaturePad';
import { Tooltip } from '@chakra-ui/react';

const DocumentsPage = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";
  const isEmpresa = userRole === "Empresa";
  const isAdm = userRole === "Administrador Geral";
  const isCandidato = userRole === "Candidato";

  return (
    <ResourceScreen 
      title='Documentos'
      permissions={['']}
      resource='Documents'
      routeBase={routes.documents}
      canAdd={false}
      canView={false}
      canEdit={false}
      canRemove={isAdm}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[
        {
          field: 'status',
          header: 'Status',
          type: 'select',
          options: [
            { value: '0', header: 'Gerado' },
            { value: '1', header: 'Enviado' },
            { value: '2', header: 'Devolvido'},
            { value: '3', header: 'Aguardando assinatura Empresa' },
            { value: '4', header: 'Aguardando assinatura Escola' },
            { value: '5', header: 'Assinado' },
          ],
          serverType: 'equals'
        },
        {
          field: 'created_at',
          header: 'Criado em',
          type: 'date-range'
        }
      ]}
      columns={[
        ...(isEscola || isEmpresa
          ? [
              {
                Header: 'Assinar',
                accessor: 'sign',
                Cell: ({ row }) => {
                  const assinaveis = ['Contrato', 'Protocolo'];
                  if (!assinaveis.includes(row.original.type)) return null;
        
                  const { status, attachable } = row.original;
        
                  if (status === '5') return null;

                  if (isEmpresa) {
                    if (status !== '3') return null;
                    if (attachable.company_signature !== 0) return null;
                  }
        
                  if (isEscola) {
                    if (status !== '4') return null;
                    if (attachable.school_signature !== 0) return null;
                  }
        
                  return (
                    <WithModal
                      title="Assinar Documento"
                      modal={<SignaturePad documentId={row.original.attachable_id} />}
                      size="xl"
                    >
                      {({ toggleModal }) => (
                        <Tooltip label="Assinar" hasArrow>
                          <Button colorScheme="blue" size="xs" onClick={toggleModal}>
                            <MdEdit />
                          </Button>
                        </Tooltip>
                      )}
                    </WithModal>
                  );
                },
              },
            ]
          : []),
        /* {
          Header: 'ID',
          accessor: 'id'
        }, */
        {
          Header: 'Tipo',
          accessor: (originalData) => {
            const availableNames = {
              Candidate: {
                name: 'Candidato',
                url: getRoute(routes.candidates.edit, {
                  id: originalData.attachable_id
                })
              },
              School: {
                name: 'Escola',
                url: getRoute(routes.schools.edit, {
                  id: originalData.attachable_id
                })
              },
              Company: {
                name: 'Empresa',
                url: getRoute(routes.companies.edit, {
                  id: originalData.attachable_id
                })
              },
              Contract: {
                name: 'Protocolo',
                url: getRoute(routes.contracts.edit, {
                  id: originalData.attachable_id
                })
              },
              Job: {
                name: 'Vaga',
                url: getRoute(routes.jobs.edit, {
                  id: originalData.attachable_id
                })
              }
            };

            const matchType = availableNames[originalData.name];
            return (
              <Link href={matchType.url} isExternal>
                <HStack>
                  <span>
                    {matchType.name} - {originalData.type}
                  </span>
                  <MdOutlineOpenInNew mx='2px' />
                </HStack>
              </Link>
            );
          }
        },
        {
          Header: 'Nome',
          accessor: (originalData) => {
            const availableNames = {
              Candidate: originalData.attachable?.name,
              School: originalData.attachable?.corporate_name,
              Company: originalData.attachable?.corporate_name,
              Contract: originalData.attachable?.candidate?.name,
              Job: originalData.attachable?.company?.corporate_name
            };

            return availableNames[originalData.name] || '';
          }
        },
        {
          Header: 'Ficheiro',
          accessor: (originalRow) => (
            <Link
              target='_blank'
              href={`${import.meta.env.VITE_BACKEND_BASE_URL}/documents/${
                originalRow.filename
              }.${originalRow.file_extension}/download`}
            >
              {originalRow.original_filename}.{originalRow.file_extension}
            </Link>
          )
        },
        {
          Header: 'Status',
          accessor: (originalData) => {
            const status = [
              <Tag size='md' variant='subtle' colorScheme='cyan'>
                <TagLeftIcon boxSize='12px' as={MdUploadFile} />
                <TagLabel>Gerado</TagLabel>
              </Tag>,
              <Tag size='md' variant='subtle' colorScheme='purple'>
                <TagLeftIcon boxSize='12px' as={MdDriveFileMoveOutline} />
                <TagLabel>Enviado</TagLabel>
              </Tag>,
              <Tag size='md' variant='subtle' colorScheme='green'>
                <TagLeftIcon boxSize='12px' as={MdOutlineDriveFileMoveRtl} />
                <TagLabel>Devolvido</TagLabel>
              </Tag>,
              <Tag size='md' variant='subtle' colorScheme='cyan'>
              <TagLeftIcon boxSize='12px' as={MdUploadFile} />
              <TagLabel>Aguardando assinatura Empresa</TagLabel>
            </Tag>,
            <Tag size='md' variant='subtle' colorScheme='cyan'>
            <TagLeftIcon boxSize='12px' as={MdUploadFile} />
            <TagLabel>Aguardando assinatura Escola</TagLabel>
          </Tag>,
            <Tag size='md' variant='subtle' colorScheme='green'>
            <TagLeftIcon boxSize='12px' as={MdUploadFile} />
            <TagLabel>Assinado</TagLabel>
          </Tag>,
            ];

            return status[originalData.status];
          }
        },
        {
          Header: 'Criado em',
          accessor: (originalData) =>
            dateFormatter(
              originalData.created_at,
              'DD/MM/YYYY HH:mm:ss',
              'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
            )
        },
        {
          Header: 'Atualizado em',
          accessor: (originalData) =>
            dateFormatter(
              originalData.updated_at,
              'DD/MM/YYYY HH:mm:ss',
              'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
            )
        }
      ]}
    />
  );
};

export default DocumentsPage;
