import React from 'react';
import {
  Spinner,
  StackDivider,
  VStack,
  HStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { MdKeyboardBackspace } from 'react-icons/md';
import _ from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import Resource from '../Resource/Resource';
import Card from '../Card/Card';
import EmptyResult from '../EmptyResult/EmptyResult';

const ResourceDetails = ({
  title,
  resource,
  routeBase,
  Details,
  wrapped,
  typeForm = 'view',
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const Container = wrapped === false ? Box : Card;

  return (
    <Resource
      resource={resource}
      redirectAfterSuccess={props.redirectAfterSuccess ? '..' : ''}
      id={id}
    >
      {(resourceProps) => {
        if (resourceProps.isLoading) {
          return <Spinner />;
        }

        return (
          <Container>
            <VStack
              spacing={4}
              align='stretch'
              divider={<StackDivider borderColor='gray.200' />}
            >
              <HStack>
                <MdKeyboardBackspace
                  size={24}
                  cursor='pointer'
                  onClick={() =>
                    navigate('..')
                  }
                />
                <Text mb='3' align='left' fontSize='3xl'>
                  {title}
                </Text>
              </HStack>

              {_.isEmpty(resourceProps.detailedRecord) ? (
                <EmptyResult />
              ) : (
                <Details
                  detailedRecord={resourceProps.detailedRecord}
                  readOnly={props.readOnly}
                  typeForm={typeForm}
                  {...resourceProps}
                />
              )}
            </VStack>
          </Container>
        );
      }}
    </Resource>
  );
};

ResourceDetails.defaultProps = {
  wrapped: false,
};

export default ResourceDetails;
