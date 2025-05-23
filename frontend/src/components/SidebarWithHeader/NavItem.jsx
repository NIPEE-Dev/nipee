import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ icon, children, to, ...rest }) => {
  return to ? (
    <NavLink to={to} end>
      {({ isActive }) => (
        <Flex
          align='center'
          px='4'
          pl='4'
          py='3'
          cursor='pointer'
          color='inherit'
          bg={isActive ? 'gray.200' : 'transparent'}
          _hover={{
            bg: 'purple.500',
            color: 'white',
          }}
          role='group'
          fontWeight='semibold'
          transition='.15s ease'
          {...rest}
        >
          {icon && (
            <Icon
              mx='2'
              boxSize='4'
              as={icon}
              _groupHover={{
                color: 'white',
              }}
            />
          )}
          {children}
        </Flex>
      )}
    </NavLink>
  ) : (
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
      {...rest}
    >
      {icon && (
        <Icon
          mx='2'
          boxSize='4'
          as={icon}
          _groupHover={{
            color: 'white',
          }}
        />
      )}
      {children}
    </Flex>
  );
};

export default NavItem;
