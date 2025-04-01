import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import {
  Button,
  Center,
  chakra,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import ImageIcon from '../ImageIcon/ImageIcon';
import { dateFormatter } from '../../utils/visualization';
import Resource from '../Resource/Resource';
import FormField from '../FormField/FormField';
import { ModalConfirm } from '../WithModal/ModalConfirm';
import { WithModal } from '../WithModal';
import { DeleteDocumentModal } from './DeleteDocumentModal';

const DocumentsTable = ({
  typeForm,
  readOnly = false,
  documents: documentsList,
  thContent
}) => {
  const [documents, setDocuments] = useState([]);
  const toast = useToast();
  useEffect(() => {
    setDocuments(documentsList);
  }, [documentsList]); 

  const statuses = ['Gerado', 'Enviado', 'Devolvido', 'Aguardando assinatura Empresa', 'Aguardando assinatura Escola', 'Assinado'];

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th width='1px'>{thContent}</Th>
            <Th>Criado em</Th>
            <Th>Tipo</Th>
            <Th>Nome</Th>
            {/* <Th>Status do documento</Th> */}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {documents.length === 0 && (
            <Tr>
              <Th bg='blackAlpha.50' colSpan='100%'>
                <Center>Nenhum registro encontrado</Center>
              </Th>
            </Tr>
          )}
          {documents.map((file, fileIndex) => (
            <Tr key={file.id}>
              <Td width='1px'>
                <ImageIcon fileExtension={file.file_extension} />
              </Td>
              <Td>
                {dateFormatter(
                  file.created_at,
                  'DD/MM/YYYY HH:mm',
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </Td>
              <Td>{file.type}</Td>
              <Td>
                <Link
                  target='_blank'
                  href={`${import.meta.env.VITE_BACKEND_BASE_URL}/documents/${
                    file.filename
                  }.${file.file_extension}/download`}
                >
                  {file.original_filename}.{file.file_extension}
                </Link>
              </Td>
              <Resource resource='Documents' autoFetch={false}>
                {({ update, savingRecords, remove, removingRecords }) => (
                  <>
                    {/* <Td>
                      {typeForm === 'view' || readOnly ? (
                        statuses[file.status]
                      ) : (
                        <Field
                          id={`documents.${fileIndex}.status`}
                          name={`documents.${fileIndex}.status`}
                          component={FormField.Select}
                          onChangeCallback={(e) =>
                            update(file.id, { status: e.target.value })
                          }
                          readOnly={typeForm === 'view'}
                          isLoading={savingRecords.includes(file.id)}
                          required
                          requiredIndicator={<chakra.div display='none' />}
                        >
                          <option value='0'>Gerado</option>
                          <option value='1'>Enviado</option>
                          <option value='2'>Devolvido</option>
                          <option value='3'>Aguardando assinatura Empresa</option>
                          <option value='4'>Aguardando assinatura Escola</option>
                          <option value='5'>Assinado</option>
                        </Field>
                      )}
                    </Td> */}
                    <Td>
                      {typeForm === 'edit' && !readOnly && (
                        <WithModal
                          modal={({ closeModal }) => (
                            <DeleteDocumentModal
                              isLoading={removingRecords.includes(file.id)}
                              onConfirm={(pin) => {
                                remove(file.id, { pin }).then(() => {
                                  setDocuments((currentDocuments) =>
                                    currentDocuments.filter(
                                      (d) => d.id !== file.id
                                    )
                                  );
                                  closeModal();
                                  toast({
                                    title: 'Sucesso!',
                                    description: `Arquivo apagado com sucesso!`,
                                    variant: 'left-accent',
                                    duration: 9000,
                                    isClosable: true,
                                    position: 'top',
                                    status: 'success'
                                  });
                                });
                              }}
                              onCancel={closeModal}
                            />
                          )}
                        >
                          {({ toggleModal }) => (
                            <Button
                              isLoading={removingRecords.includes(file.id)}
                              variant='outline'
                              colorScheme='red'
                              onClick={toggleModal}
                            >
                              <MdDelete />
                            </Button>
                          )}
                        </WithModal>
                      )}
                    </Td>
                  </>
                )}
              </Resource>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DocumentsTable;
