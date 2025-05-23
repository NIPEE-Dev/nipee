import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { NavLink as RouterDomLink } from 'react-router-dom';

const NavItem = ({ icon, children, color, ...rest }) => (
  <Flex
    align='center'
    px='4'
    pl='4'
    py='3'
    cursor='pointer'
    color='inherit'
    _hover={{
      bg: 'purple.500',
      color: 'white',
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
          color: 'white',
        }}
        as={icon}
      />
    )}
    {children}
  </Flex>
);

export default NavItem;
