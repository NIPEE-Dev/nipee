import React, { useState } from 'react';
import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack
} from '@chakra-ui/react';

export const DeleteDocumentModal = ({ onConfirm, isLoading }) => {
  const [pin, setPin] = useState('');

  return (
    <Center>
      <VStack dir='column' mb={2} spacing={15}>
        <Heading>Tem certeza?</Heading>
        <Text align='center'>
          <div>Essa ação irá excluir o documento.</div>
        </Text>

        <Divider my={5} />

        <Center fontWeight='semibold'>Senha para exclusão</Center>
        <HStack>
          <PinInput onChange={(e) => setPin(e)}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>

        <Button
          mt={3}
          disabled={pin.length !== 6 || isLoading}
          isLoading={isLoading}
          onClick={() => {
            onConfirm(pin);
          }}
        >
          Confirmar
        </Button>
      </VStack>
    </Center>
  );
};
