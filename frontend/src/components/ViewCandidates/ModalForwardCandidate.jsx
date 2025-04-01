import React, { useState } from 'react';
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack
} from '@chakra-ui/react';

export const ModalForwardCandidate = ({ onConfirm }) => {
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');

  return (
    <Center>
      <VStack dir='column' mb={2} spacing={15}>
        <Heading>Encaminhar utilizador</Heading>

        <FormControl mb={3}>
          <FormLabel htmlFor='forward_date'>Data da entrevista</FormLabel>
          <Input
            id='forward_date'
            _placeholder={{ textAlign: 'center' }}
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel htmlFor='fordward_hour'>Horário da entrevista</FormLabel>
          <Input
            id='fordward_hour'
            _placeholder={{ textAlign: 'center' }}
            type='time'
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          />
        </FormControl>

        <Button
          disabled={!date.length > 0 || !hour.length > 0}
          onClick={() => {
            onConfirm({ date, hour });
          }}
        >
          Encaminhar
        </Button>
      </VStack>
    </Center>
  );
};
