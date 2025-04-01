import React from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import SidebarContent from './SidebarContent';
import { username, role } from '../../store/ducks/auth';

const SidebarWithHeader = ({ handleLogout, username, role, children }) => {
  const sidebar = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as='section'
      bg={useColorModeValue('gray.50', 'gray.700')}
      minH='100vh'
    >
      <SidebarContent display={{ base: 'none', md: 'unset' }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement='left'
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w='full' borderRight='none' />
        </DrawerContent>
      </Drawer>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height='20'
        alignItems='center'
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth='1px'
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={sidebar.onOpen}
          variant='outline'
          aria-label='open menu'
          icon={<FiMenu />}
        />

        <HStack spacing={{ base: '0', md: '6' }}>
          <IconButton
            size='lg'
            variant='ghost'
            aria-label='open menu'
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          />
          <Flex alignItems='center'>
            <Menu>
              <MenuButton
                py={2}
                transition='all 0.3s'
                _focus={{ boxShadow: 'none' }}
              >
                <HStack>
                  <Avatar size='sm' name={username} />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems='flex-start'
                    spacing='1px'
                    ml='2'
                  >
                    <Text fontSize='sm'>{username}</Text>
                    <Text fontSize='xs' color='gray.600'>
                      {role}
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <MenuItem onClick={() => handleLogout()}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  username: username(state),
  role: role(state),
});

export default connect(mapStateToProps)(SidebarWithHeader);
