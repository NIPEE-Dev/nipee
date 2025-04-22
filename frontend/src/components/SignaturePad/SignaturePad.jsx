import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import useUploadSignature from '../../hooks/useUploadSignature';
import { Text, 
  useToast, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormErrorMessage, 
  Button,
  useColorMode,
  useColorModeValue, 
  Flex,
  Box} from '@chakra-ui/react';

function SignaturePad({ documentId, onSuccess }) {
  const [url, setUrl] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const signRef = useRef(null);
  const { uploadSignature, loading, error, successMessage } = useUploadSignature();
  const navigate = useNavigate();

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const type = userRole === 'Empresa' ? 'empresa' : userRole === 'Escola' ? 'escola' : '';
  const contractId = documentId;

  const handleClear = () => {
    if (signRef.current) signRef.current.clear();
    setUrl('');
  };

  const handleAttemptSubmit = () => {
    if (!signRef.current || signRef.current.isEmpty()) {
      alert('Por favor, faça sua assinatura antes de enviar.');
      return;
    }
    setShowConfirm(true);
  };

  // Called when user confirms
  const handleConfirm = async () => {
    setShowConfirm(false);
    const imageData = signRef.current.getTrimmedCanvas().toDataURL('image/png');
    setUrl(imageData);
    try {
      await uploadSignature(contractId, imageData, type);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        navigate('/documents');
      }, 500);
    } catch (err) {
      console.error('Erro ao enviar a assinatura:', err);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <Box>
      <Text mb={4}>
        Faça a sua assinatura. A assinatura realizada aqui será adicionada ao protocolo.
      </Text>

      <Box border='2px solid' w={125} h={50}
      backgroundColor={useColorModeValue('white', 'gray.700')}
      color={useColorModeValue('black', 'white')}>
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          ref={signRef}
        />
      </Box>

      <br />
      <Flex justify="space-between" mt={6} wrap="wrap">
      <Button
              variant="outline"
              colorScheme="gray"
              px={6}
              py={3}
              onClick={handleClear}
            >
              Limpar
            </Button>
      <Button
            fontWeight="bold"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            py={3}
            onClick={handleAttemptSubmit}
            loadingText="Enviando..."
            >
        Assinar
      </Button>
      </Flex>

      <br /><br />
      {loading && <Text>Enviando assinatura...</Text>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Modal isOpen={showConfirm} onClose={handleCancel} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bgGradient="linear(to-r, #5931E9, #7289FF)"
          color="white"
          borderRadius="lg"
          boxShadow="2xl"
          overflow="hidden"
          transform="scale(1.05)"
          transition="all 0.3s ease-in-out"
          mx={4}
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="white"
            mt={4}
          >
            Declaração de Aceitação
          </ModalHeader>
          <ModalBody textAlign="center" py={6} px={8}>
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text as='p'>Eu, {userProfile.username}, titular do NIF (NIF), declaro que li e compreendi todos os termos e condições apresentados, e concordo com os mesmos.</Text>
            <Text as='p'>Ao assinar digitalmente este documento, manifesto a minha aceitação plena e consciente, conferindo-lhe validade legal para todos os efeitos.</Text>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center" pb={4}>
          <Button
            fontWeight="bold"
            bgGradient="linear(to-r, #E53935, #FF6F61)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #FF6F61, #E53935)" }}
            py={3}
            mr={4}
            onClick={handleCancel}
            loadingText="Cancelando..."
            >
              Cancelar
            </Button>
            <Button
            fontWeight="bold"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            py={3}
            onClick={handleConfirm}
            loadingText="Enviando..."
            >
            Aceitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SignaturePad;
