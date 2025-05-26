import React, { useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import moment from 'moment';
import {
  Button,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Select,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import Resource from '../../components/Resource/Resource';

export const TerminateContractModal = ({ onConfirm }) => {
  const [motive, setMotive] = useState('');
  const [payCurrentMonth, setPaycurrentMonth] = useState(1);
  const [terminatedAt, setTerminatedAt] = useState(
    moment().format('YYYY-MM-DD')
  );

  return (
    <Center>
      <VStack dir='column' mb={2} spacing={15}>
        <Heading>Tem certeza?</Heading>
        <Text align='center'>
          <div>
            Essa ação irá rescindir o protocolo atual.
            <br /> O protocolo não poderá ser alterado.
          </div>
        </Text>
        <Divider />
        <FormControl>
  <FormLabel>Motivo da rescisão</FormLabel>
  <Input
    id='motive'
    value={motive}
    onChange={(e) => setMotive(e.target.value)}
    placeholder='Descreva o motivo...'
  />
</FormControl>

        <FormControl>
          <FormLabel>Data da rescisão</FormLabel>
          <Input
            type='date'
            value={terminatedAt}
            onChange={(e) => setTerminatedAt(e.target.value)}
          />
        </FormControl>

        <Divider my={5} />

        <Button
          mt={3}
          disabled={
            motive.length === 0 ||
            (+payCurrentMonth !== 0 && +payCurrentMonth !== 1)
          }
          onClick={() => {
            onConfirm(motive, payCurrentMonth, terminatedAt);
          }}
        >
          Confirmar
        </Button>
      </VStack>
    </Center>
  );
};
