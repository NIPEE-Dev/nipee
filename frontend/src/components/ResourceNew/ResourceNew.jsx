import React from 'react';
import {
  HStack,
  StackDivider,
  Text,
  VStack,
  useToast,
  Box,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Resource from '../Resource/Resource';
import Card from '../Card/Card';

const ResourceNew = ({ resource, Form, routeBase, wrapped, ...props }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const Container = wrapped ? Card : Box;

  return (
    <Resource resource={resource} redirectAfterSuccess>
      {({ create, isLoading, errors, redirectAfterSuccess }) => (
        <Container>
          <VStack
            spacing={4}
            align='stretch'
            divider={<StackDivider borderColor='gray.200' />}
          >
            <HStack>
              <Tooltip hasArrow label='Voltar'>
                <Box as="span" tabIndex={0}>
                  <MdKeyboardBackspace
                    size={24}
                    cursor='pointer'
                    onClick={() =>
                      navigate(-1)
                    }
                  />
                </Box>
              </Tooltip>
              <Text mb='3' align='left' fontSize='3xl'>
                Adicionar
              </Text>
            </HStack>

            <Form
              initialErrors={errors}
              initialValues={{}}
              {...props}
              onSubmit={(values) =>
                create(values).then(() => {
                  if (redirectAfterSuccess) {
                    navigate('..', {
                      replace: true
                    });
                  }

                  toast({
                    title: 'Sucesso!',
                    description: `Registo criado com sucesso!`,
                    variant: 'left-accent',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                    status: 'success',
                  });
                })
              }
              isLoading={isLoading}>
                <Box py={3} textAlign='right'>
                    <Button mt='3' colorScheme='blue' type='submit' isLoading={isLoading}>
                      Salvar
                    </Button>
                  </Box>
              </Form>
          </VStack>
        </Container>
      )}
    </Resource>
  );
};

ResourceNew.defaultProps = {
  redirectAfterSuccess: true,
  wrapped: false,
};

export default ResourceNew;
