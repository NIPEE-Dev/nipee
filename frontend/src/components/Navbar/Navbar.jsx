import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Spacer,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi'; // Menu icon
import logo from '/src/images/logo.png';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegister = () => {
    const section = document.getElementById('registrar');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      onClose(); // Close drawer if open
    }
  };

  return (
    <Box
      as="header"
      bg="white"
      px={0}
      py={4}
      boxShadow={isScrolled ? 'md' : 'sm'}
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
      transition="box-shadow 0.3s ease, background-color 0.3s ease"
    >
      <Flex align="center" maxW="80%" mx="auto">
        {/* Logo and nav links */}
        <HStack spacing={8}>
          <img src={logo} alt="Logo NIPEE" width={210} height={112} />
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link href="#sobre" fontWeight="medium">Sobre nós</Link>
            <Link href="#contato" fontWeight="medium">Contacto</Link>
          </HStack>
        </HStack>

        <Spacer />

        {/* Desktop actions */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          <Link href="/login" fontWeight="medium">Entrar</Link>
          <Button
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: 'linear(to-r, #7289FF, #5931E9)' }}
            onClick={scrollToRegister}
          >
            Registar
          </Button>
        </HStack>

        {/* Mobile menu button */}
        <IconButton
          aria-label="Abrir menu"
          icon={<FiMenu />}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          bg="transparent"
          _hover={{ bg: 'gray.100' }}
        />
      </Flex>

      {/* Mobile drawer menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent width="100vw" maxW="100vw">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Link href="#sobre" fontWeight="medium" onClick={onClose}>Sobre nós</Link>
              <Link href="#contato" fontWeight="medium" onClick={onClose}>Contacto</Link>
              <Link href="/login" fontWeight="medium" onClick={onClose}>Entrar</Link>
              <Button
                w="full"
                bgGradient="linear(to-r, #5931E9, #7289FF)"
                color="white"
                onClick={scrollToRegister}
              >
                Registar
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
