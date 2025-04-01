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
} from '@chakra-ui/react';
import logo from '/src/images/logo.png';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      as="header"
      bg="white"
      px={4}
      py={4}
      boxShadow={isScrolled ? 'md' : 'sm'}
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
      transition="box-shadow 0.3s ease, background-color 0.3s ease"
    >
      <Flex align="center" maxW="1200px" mx="auto">
        {/* Logo */}
        <HStack spacing={8}>
          <img src={logo} alt="Logo NIPEE" width={160} height={112} />
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link href="#sobre" fontWeight="medium">
              Sobre nós
            </Link>
            <Link href="#contato" fontWeight="medium">
              Contacto
            </Link>
          </HStack>
        </HStack>

        <Spacer />

        {/* Desktop */}
        <HStack spacing={10} display={{ base: 'none', md: 'flex' }}>
          <Link href="/login" variant="link" colorScheme="black">
            Entrar
          </Link>
          <Button
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: 'linear(to-r, #7289FF, #5931E9)' }}
            onClick={() => {
              const section = document.getElementById('registrar');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Registar
          </Button>
        </HStack>

        {/* Mobile */}
        <IconButton
          aria-label="Open menu"
          icon={<box-icon name="menu"></box-icon>}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          bg="transparent"
          _hover={{ bg: 'gray.100' }}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="100vw" width="100vw">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Link
              href="#sobre"
              fontWeight="medium"
              display="block"
              mb={4}
              onClick={onClose}
            >
              Sobre nós
            </Link>
            <Link
              href="#contato"
              fontWeight="medium"
              display="block"
              mb={4}
              onClick={onClose}
            >
              Contacto
            </Link>
            <Link
              href="/login"
              variant="link"
              colorScheme="black"
              display="block"
              w="full"
              mb={4}
              onClick={onClose}
            >
              Entrar
            </Link>
            <Button
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              w="full"
              onClick={() => {
                const section = document.getElementById('registrar');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Registar
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
