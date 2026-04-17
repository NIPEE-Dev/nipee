import React, { useMemo, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

const initialUnidades = [
  {
    id: 1,
    nome: "Unidade de Engenharia e Tecnologia",
    email: "engenharia@nipee.pt",
    senha: "123456",
    setores: [
      {
        id: 11,
        nome: "Setor de Desenvolvimento",
        email: "desenvolvimento@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 18,
      },
      {
        id: 12,
        nome: "Setor de Infraestrutura",
        email: "infraestrutura@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 9,
      },
    ],
  },
  {
    id: 2,
    nome: "Unidade de Saúde e Bem-Estar",
    email: "saude@nipee.pt",
    senha: "123456",
    setores: [
      {
        id: 21,
        nome: "Setor de Fisioterapia",
        email: "fisioterapia@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 14,
      },
      {
        id: 22,
        nome: "Setor de Nutrição",
        email: "nutricao@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 11,
      },
    ],
  },
  {
    id: 3,
    nome: "Unidade de Gestão e Administração",
    email: "gestao@nipee.pt",
    senha: "123456",
    setores: [
      {
        id: 31,
        nome: "Setor Financeiro",
        email: "financeiro@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 7,
      },
      {
        id: 32,
        nome: "Setor de Recursos Humanos",
        email: "rh@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 10,
      },
      {
        id: 33,
        nome: "Setor Administrativo",
        email: "administrativo@nipee.pt",
        senha: "123456",
        quantidadeAlunos: 6,
      },
    ],
  },
];

const emptyUnidadeForm = {
  nome: "",
  email: "",
  senha: "",
};

const emptySetorForm = {
  unidadeId: "",
  nome: "",
  email: "",
  senha: "",
  quantidadeAlunos: "",
};

const UnidadesSetores = () => {
  const [unidades, setUnidades] = useState(initialUnidades);
  const [openRowId, setOpenRowId] = useState(null);

  const [isUnidadeModalOpen, setIsUnidadeModalOpen] = useState(false);
  const [isSetorModalOpen, setIsSetorModalOpen] = useState(false);
  const [editingUnidadeId, setEditingUnidadeId] = useState(null);
  const [editingSetor, setEditingSetor] = useState(null);
  const [unidadeForm, setUnidadeForm] = useState(emptyUnidadeForm);
  const [setorForm, setSetorForm] = useState(emptySetorForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const cancelRef = useRef();

  const nextUnidadeId = useMemo(() => {
    return unidades.reduce((maxId, unidade) => Math.max(maxId, unidade.id), 0) + 1;
  }, [unidades]);

  const nextSetorId = useMemo(() => {
    const allSetores = unidades.flatMap((unidade) => unidade.setores);
    return allSetores.reduce((maxId, setor) => Math.max(maxId, setor.id), 0) + 1;
  }, [unidades]);

  const handleToggleRow = (unidadeId) => {
    setOpenRowId((currentId) => (currentId === unidadeId ? null : unidadeId));
  };

  const openCreateUnidadeModal = () => {
    setEditingUnidadeId(null);
    setUnidadeForm(emptyUnidadeForm);
    setIsUnidadeModalOpen(true);
  };

  const openEditUnidadeModal = (unidade) => {
    setEditingUnidadeId(unidade.id);
    setUnidadeForm({
      nome: unidade.nome,
      email: unidade.email,
      senha: unidade.senha,
    });
    setIsUnidadeModalOpen(true);
  };

  const closeUnidadeModal = () => {
    setIsUnidadeModalOpen(false);
    setEditingUnidadeId(null);
    setUnidadeForm(emptyUnidadeForm);
  };

  const openCreateSetorModal = (unidadeId = "") => {
    setEditingSetor(null);
    setSetorForm({
      ...emptySetorForm,
      unidadeId: unidadeId ? String(unidadeId) : "",
    });
    setIsSetorModalOpen(true);
  };

  const openEditSetorModal = (unidadeId, setor) => {
    setEditingSetor({ unidadeId, setorId: setor.id });
    setSetorForm({
      unidadeId: String(unidadeId),
      nome: setor.nome,
      email: setor.email,
      senha: setor.senha,
      quantidadeAlunos: String(setor.quantidadeAlunos),
    });
    setIsSetorModalOpen(true);
  };

  const closeSetorModal = () => {
    setIsSetorModalOpen(false);
    setEditingSetor(null);
    setSetorForm(emptySetorForm);
  };

  const handleSaveUnidade = () => {
    if (!unidadeForm.nome || !unidadeForm.email || !unidadeForm.senha) {
      return;
    }

    if (editingUnidadeId) {
      setUnidades((currentUnidades) =>
        currentUnidades.map((unidade) =>
          unidade.id === editingUnidadeId
            ? {
                ...unidade,
                nome: unidadeForm.nome,
                email: unidadeForm.email,
                senha: unidadeForm.senha,
              }
            : unidade
        )
      );
    } else {
      setUnidades((currentUnidades) => [
        ...currentUnidades,
        {
          id: nextUnidadeId,
          nome: unidadeForm.nome,
          email: unidadeForm.email,
          senha: unidadeForm.senha,
          setores: [],
        },
      ]);
    }

    closeUnidadeModal();
  };

  const handleSaveSetor = () => {
    if (
      !setorForm.unidadeId ||
      !setorForm.nome ||
      !setorForm.email ||
      !setorForm.senha
    ) {
      return;
    }

    const selectedUnidadeId = Number(setorForm.unidadeId);
    const quantidadeAlunos = Number(setorForm.quantidadeAlunos) || 0;

    setUnidades((currentUnidades) => {
      if (editingSetor) {
        const origemUnidadeId = editingSetor.unidadeId;
        const setorId = editingSetor.setorId;
        let setorAtualizado = null;

        const unidadesSemSetorAntigo = currentUnidades.map((unidade) => {
          if (unidade.id !== origemUnidadeId) {
            return unidade;
          }

          return {
            ...unidade,
            setores: unidade.setores.filter((setor) => {
              const shouldKeep = setor.id !== setorId;
              if (!shouldKeep) {
                setorAtualizado = {
                  ...setor,
                  nome: setorForm.nome,
                  email: setorForm.email,
                  senha: setorForm.senha,
                  quantidadeAlunos,
                };
              }
              return shouldKeep;
            }),
          };
        });

        return unidadesSemSetorAntigo.map((unidade) => {
          if (unidade.id !== selectedUnidadeId) {
            return unidade;
          }

          return {
            ...unidade,
            setores: [...unidade.setores, setorAtualizado],
          };
        });
      }

      return currentUnidades.map((unidade) => {
        if (unidade.id !== selectedUnidadeId) {
          return unidade;
        }

        return {
          ...unidade,
          setores: [
            ...unidade.setores,
            {
              id: nextSetorId,
              nome: setorForm.nome,
              email: setorForm.email,
              senha: setorForm.senha,
              quantidadeAlunos,
            },
          ],
        };
      });
    });

    setOpenRowId(selectedUnidadeId);
    closeSetorModal();
  };

  const openDeleteDialog = (target) => {
    setDeleteTarget(target);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.type === "unidade") {
      setUnidades((currentUnidades) =>
        currentUnidades.filter((unidade) => unidade.id !== deleteTarget.unidadeId)
      );

      if (openRowId === deleteTarget.unidadeId) {
        setOpenRowId(null);
      }
    }

    if (deleteTarget.type === "setor") {
      setUnidades((currentUnidades) =>
        currentUnidades.map((unidade) =>
          unidade.id === deleteTarget.unidadeId
            ? {
                ...unidade,
                setores: unidade.setores.filter(
                  (setor) => setor.id !== deleteTarget.setorId
                ),
              }
            : unidade
        )
      );
    }

    closeDeleteDialog();
  };

  const deleteMessage =
    deleteTarget?.type === "unidade"
      ? "Tem certeza que deseja excluir esta unidade e todos os setores vinculados?"
      : "Tem certeza que deseja excluir este setor?";

  return (
    <Box p={6}>
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="lg" mb={2}>
            Unidades e Setores
          </Heading>
          <Text color="gray.600">
            Gerencie unidades e setores em uma única visualização.
          </Text>
        </Box>

        <Flex gap={3} direction={{ base: "column", sm: "row" }}>
          <Button leftIcon={<MdAdd />} colorScheme="blue" onClick={openCreateUnidadeModal}>
            Criar unidade
          </Button>
          <Button variant="outline" leftIcon={<MdAdd />} onClick={() => openCreateSetorModal()}>
            Criar setor
          </Button>
        </Flex>
      </Flex>

      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        bg="white"
      >
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th w="60px"></Th>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Quantidade de setores cadastrados</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {unidades.map((unidade) => {
              const isOpen = openRowId === unidade.id;

              return (
                <React.Fragment key={unidade.id}>
                  <Tr>
                    <Td>
                      <IconButton
                        aria-label={isOpen ? "Ocultar setores" : "Mostrar setores"}
                        icon={isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleRow(unidade.id)}
                      />
                    </Td>
                    <Td>{unidade.nome}</Td>
                    <Td>{unidade.email}</Td>
                    <Td>
                      <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                        {unidade.setores.length}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<MdAdd />}
                          onClick={() => openCreateSetorModal(unidade.id)}
                        >
                          Setor
                        </Button>
                        <IconButton
                          aria-label="Editar unidade"
                          icon={<MdEdit />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => openEditUnidadeModal(unidade)}
                        />
                        <IconButton
                          aria-label="Excluir unidade"
                          icon={<MdDelete />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() =>
                            openDeleteDialog({
                              type: "unidade",
                              unidadeId: unidade.id,
                            })
                          }
                        />
                      </Flex>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td colSpan={5} p={0} borderBottom={isOpen ? "1px solid" : "0"}>
                      <Collapse in={isOpen} animateOpacity>
                        <Box bg="gray.50" px={6} py={4}>
                          <Text fontWeight="semibold" mb={3}>
                            Setores da unidade
                          </Text>

                          <Table size="sm" variant="simple" bg="white">
                            <Thead bg="gray.100">
                              <Tr>
                                <Th>Nome</Th>
                                <Th>Email</Th>
                                <Th>Quantidade de alunos</Th>
                                <Th>Ações</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {unidade.setores.length > 0 ? (
                                unidade.setores.map((setor) => (
                                  <Tr key={setor.id}>
                                    <Td>{setor.nome}</Td>
                                    <Td>{setor.email}</Td>
                                    <Td>{setor.quantidadeAlunos}</Td>
                                    <Td>
                                      <Flex gap={2}>
                                        <IconButton
                                          aria-label="Editar setor"
                                          icon={<MdEdit />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="blue"
                                          onClick={() => openEditSetorModal(unidade.id, setor)}
                                        />
                                        <IconButton
                                          aria-label="Excluir setor"
                                          icon={<MdDelete />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="red"
                                          onClick={() =>
                                            openDeleteDialog({
                                              type: "setor",
                                              unidadeId: unidade.id,
                                              setorId: setor.id,
                                            })
                                          }
                                        />
                                      </Flex>
                                    </Td>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={4} textAlign="center" py={4} color="gray.500">
                                    Nenhum setor cadastrado para esta unidade.
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isUnidadeModalOpen} onClose={closeUnidadeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingUnidadeId ? "Editar unidade" : "Criar unidade"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={unidadeForm.nome}
                onChange={(event) =>
                  setUnidadeForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={unidadeForm.email}
                onChange={(event) =>
                  setUnidadeForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={unidadeForm.senha}
                onChange={(event) =>
                  setUnidadeForm((current) => ({
                    ...current,
                    senha: event.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={closeUnidadeModal}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSaveUnidade}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSetorModalOpen} onClose={closeSetorModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingSetor ? "Editar setor" : "Criar setor"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Unidade</FormLabel>
              <Select
                placeholder="Selecione a unidade"
                value={setorForm.unidadeId}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    unidadeId: event.target.value,
                  }))
                }
              >
                {unidades.map((unidade) => (
                  <option key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={setorForm.nome}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={setorForm.email}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={setorForm.senha}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    senha: event.target.value,
                  }))
                }
              />
            </FormControl>
            
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={closeSetorModal}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSaveSetor}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={Boolean(deleteTarget)}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar exclusão
            </AlertDialogHeader>

            <AlertDialogBody>{deleteMessage}</AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UnidadesSetores;
