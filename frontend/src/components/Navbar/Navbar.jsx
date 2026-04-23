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
import { FiMenu } from 'react-icons/fi';
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
        <HStack spacing={8}>
          <Link href="/">
             <img src={logo} alt="Logo NIPEE" width={210} height={112} />
          </Link>

          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link href="/vagas-em-aberto" fontWeight="medium">Vagas em Aberto</Link>
            <Link href="/escolas-registadas" fontWeight="medium">Escolas Registadas</Link>
            <Link href="/#sobre" fontWeight="medium">Sobre nós</Link>
            <Link href="/#contato" fontWeight="medium">Contacto</Link>
            <Link href="/registar-candidato" fontWeight="medium">Registar candidato</Link>
          </HStack>
        </HStack>

        <Spacer />

        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          <Link href="/login" fontWeight="medium">Entrar</Link>
          <Button
            bg="#155dfc"
            color="white"
            cursor="pointer"
            px={8}
            py={6}
            borderRadius="full"
            fontWeight="semibold"
            boxShadow="0 12px 30px rgba(21, 93, 252, 0.28)"
            _hover={{ bg: '#0f4fd6', transform: 'translateY(-1px)' }}
            _active={{ bg: '#0b43b6' }}
            transition="all 0.2s ease"
            as="a"
            href="/registar-empresa"
          >
            Registar empresa
          </Button>
        </HStack>

        <IconButton
          aria-label="Abrir menu"
          icon={<FiMenu />}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          bg="transparent"
          _hover={{ bg: 'gray.100' }}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent width="100vw" maxW="100vw">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              {/* VERSÃO MOBILE */}
              <Link href="/vagas-em-aberto" fontWeight="medium" onClick={onClose}>Vagas em Aberto</Link>
              <Link href="/escolas-registadas" fontWeight="medium" onClick={onClose}>Escolas Registadas</Link>
              
              <Link href="/#sobre" fontWeight="medium" onClick={onClose}>Sobre nós</Link>
              <Link href="/#contato" fontWeight="medium" onClick={onClose}>Contacto</Link>
              <Link href="/registar-candidato" fontWeight="medium" onClick={onClose}>Registar candidato</Link>
              <Link href="/login" fontWeight="medium" onClick={onClose}>Entrar</Link>
              
              <Button
                w="full"
                bg="#155dfc"
                color="white"
                cursor="pointer"
                py={6}
                borderRadius="xl"
                fontWeight="semibold"
                _hover={{ bg: '#0f4fd6' }}
                _active={{ bg: '#0b43b6' }}
                as="a"
                href="/registar-empresa"
              >
                Registar empresa
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
