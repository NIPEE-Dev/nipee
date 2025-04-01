import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import resolve from '../../utils/resolve';

const WithModal = ({ title, modal, size, children, ...props }) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleModal = () => {
    setIsOpened(!isOpened);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  return (
    <React.Fragment>
      {children({
        toggleModal,
        closeModal,
        isOpened
      })}

      <Modal isOpen={isOpened} size={size} onClose={closeModal}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {resolve(modal, {
              ...props,
              toggleModal,
              closeModal
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

WithModal.propTypes = {
  /** Conteúdo do modal */
  modal: PropTypes.any.isRequired,

  /** Tamanho do modal */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),

  /** Render function com a função para togglear o modal */
  children: PropTypes.func.isRequired
};

WithModal.defaultProps = {
  size: 'md'
};

export default WithModal;
