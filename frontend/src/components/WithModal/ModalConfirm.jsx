import React from 'react';
import { Center, Button, Heading, Text, VStack } from '@chakra-ui/react';

export const ModalConfirm = ({ onConfirm, text }) => (
  <Center>
    <VStack dir='column' mb={2} spacing={15}>
      <Heading>Tem certeza?</Heading>
      <Text align='center'>{text || 'Essa ação não pode ser desfeita'}</Text>

      <Button
        onClick={() => {
          onConfirm();
        }}
      >
        Confirmar
      </Button>
    </VStack>
  </Center>
);
