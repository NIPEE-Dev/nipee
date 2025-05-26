import React from 'react';
import _map from 'lodash/map';
import { Box, Divider, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { menuItems } from './menuItems';
import NavItemController from './NavItemController';
import withAuth from '../../store/utils/withAuth';
import logo from '../../images/logo.png';
import logoClaro from './../../images/logoClaron.png';

const SidebarContent = (props) => {
  const color = useColorModeValue('gray.600', 'gray.300');
  return (
    <Box
      as='nav'
      pos='fixed'
      top='0' 
      left='0' 
      zIndex='sticky'
      h='full'
      pb='10'
      overflowX='hidden'
      overflowY='auto'
      bg={useColorModeValue('white', 'gray.800')}
      borderColor={useColorModeValue('inherit', 'gray.700')}
      borderRightWidth='1px'
      w='60'
      {...props}
    >
      <Flex px='4' py='3' align='center'>
      <Image 
        src={useColorModeValue(logo, logoClaro)} 
        pb='1' 
        alt='Logomarca' 
      />
      </Flex>
      <Divider mt='-1px' />
      <Flex
        direction='column'
        as='nav'
        fontSize='sm'
        color='gray.600'
        aria-label='Main Navigation'
      >
        {menuItems
          .filter((item) => {
            if (item.children?.length) {
              const { permissions } = props.auth;
              return (
                _map(item.children, 'permission').filter((value) =>
                  permissions.includes(value)
                ).length > 0
              );
            }

            return true;
          })
          .map((menu) => (
            <NavItemController key={menu.name} menu={menu} color={color} />
          ))}
      </Flex>
    </Box>
  );
};

export default withAuth(SidebarContent);
  