import React from 'react';
import update from 'immutability-helper';
import { Button, Tooltip } from '@chakra-ui/react';
import { RiFileAddLine } from 'react-icons/ri';
import { WithModal } from '../WithModal';
import Resource from '../Resource/Resource';
import FileUploadContent from './FileUploadContent';

const FileUpload = ({ types, resource, model }) => (
  <Resource resource='FileUpload'>
    {({ create, isLoading }) => (
      <WithModal
        modal={({ closeModal }) => (
          <FileUploadContent
            isLoading={isLoading}
            types={types}
            create={(filesFormData) => {
              filesFormData.append('id', resource.id);
              filesFormData.append('model', model);
              create(filesFormData).then(
                ({
                  action: {
                    payload: {
                      data: { files }
                    }
                  }
                }) => {
                  resource.updateDetails(resource.id, (details) => {
                    details.documents.push(...files);
                    return details;
                  }
                  );
                  closeModal();
                }
              );
            }}
          />
        )}
        title='Adicionar arquivo'
      >
        {({ toggleModal }) => (
          <Tooltip hasArrow label='Adicionar arquivo'>
            <Button
              colorScheme='teal'
              variant='solid'
              type='button'
              size='sm'
              onClick={toggleModal}
            >
              <RiFileAddLine />
            </Button>
          </Tooltip>
        )}
      </WithModal>
    )}
  </Resource>
);

export default FileUpload;
