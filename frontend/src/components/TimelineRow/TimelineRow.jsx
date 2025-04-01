import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

function TimelineRow(props) {
  const { logo, title, date, color, index, arrLength } = props;
  const textColor = useColorModeValue('gray.700', 'white.300');
  const bgIconColor = useColorModeValue('white.300', 'gray.700');

  return (
    <Flex alignItems='center' minH='78px' justifyContent='start' mb='5px'>
      <Flex direction='column' alignItems='center' h='100%'>
        <Icon
          as={logo}
          bg={bgIconColor}
          color={color}
          h='30px'
          w='26px'
          zIndex='1'
          position='relative'
        />
        <Box
          w='2px'
          bg='gray.200'
          minH='50px'
          h={index === arrLength - 1 ? '15px' : '100%'}
        />
      </Flex>
      <Flex direction='column' alignSelf='start' ms={4} mt={1}>
        <Text fontSize='sm' color={textColor} fontWeight='bold'>
          {title}
        </Text>
        <Text fontSize='sm' color='gray.400' fontWeight='normal'>
          {date}
        </Text>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
