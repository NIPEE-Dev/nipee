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

export const PinConfirmationModal = ({ onConfirm, text }) => {
  const [terminationPin, setTerminationPin] = useState('');

  return (
    <Center>
      <VStack dir='column' mb={2} spacing={15}>
        <Heading>Tem certeza?</Heading>
        <Text align='center'>
          <div>{text}</div>
        </Text>

        <Divider my={5} />

        <Center fontWeight='semibold'>Senha para realizar ação</Center>
        <HStack>
          <PinInput mask onChange={(e) => setTerminationPin(e)}>
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
          disabled={terminationPin.length !== 6}
          onClick={() => {
            onConfirm(terminationPin);
          }}
        >
          Confirmar
        </Button>
      </VStack>
    </Center>
  );
};
