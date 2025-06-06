import React from 'react';
import PropTypes from 'prop-types';
import { diff } from 'deep-object-diff';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import ResourceDetails from '../ResourceDetails/ResourceDetails';

export default function ResourceUpdate({
  Form,
  title,
  resourceUpdateProps,
  ...rest
}) {
  const { id } = useParams();
  const toast = useToast();

  let navigate = useNavigate();

  return (
    <ResourceDetails
      {...rest}
      {...resourceUpdateProps}
      title={title}
      Details={(props) => (
        <Form
          initialErrors={props.errors}
          detailedRecord={props.detailedRecord}
          initialValues={props.detailedRecord}
          onSubmit={(values) => {
            const data = resourceUpdateProps.onlyDiff
              ? diff(props.detailedRecord, values)
              : values;
            props.update(id, data).then(() => {
              if (props.redirectAfterSuccess) {
                navigate(-1, {
                  replace: true
                });
              }

              toast({
                title: 'Sucesso!',
                description: `Dados alterados com sucesso`,
                variant: 'left-accent',
                duration: 9000,
                isClosable: true,
                position: 'top-right',
                status: 'success'
              });
            });
          }}
          isLoading={props.isSaving}
          updateDetails={props.updateDetails}
          title={title}
          updateResource
          resource={props}
          typeForm={rest.typeForm}
        />
      )}
    />
  );
}

ResourceUpdate.propTypes = {
  resource: PropTypes.string.isRequired,

  title: PropTypes.string.isRequired,

  Form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

  redirectAfterSuccess: PropTypes.bool
};

ResourceUpdate.defaultProps = {
  redirectAfterSuccess: true
};
