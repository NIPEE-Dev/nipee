import React from 'react';
import { Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { NavLink as RouterDomLink } from 'react-router-dom';

const NavItem = ({ icon, children, color, ...rest }) => (
  <Flex
    align='center'
    px='4'
    pl='4'
    py='3'
    cursor='pointer'
    color={useColorModeValue('inherit', 'gray.400')}
    _hover={{
      bg: useColorModeValue('gray.100', 'gray.900'),
      color: useColorModeValue('gray.900', 'gray.200'),
    }}
    role='group'
    fontWeight='semibold'
    transition='.15s ease'
    as={rest.to ? RouterDomLink : 'span'}
    {...rest}
  >
    {icon && (
      <Icon
        mx='2'
        boxSize='4'
        _groupHover={{
          color,
        }}
        as={icon}
      />
    )}
    {children}
  </Flex>
);

export default NavItem;
