import React, { useEffect, useMemo, useRef, useState } from "react";
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
  toast,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import {
  createBranch,
  createBranchSector,
  deleteBranch,
  deleteBranchSector,
  getBranches,
  updateBranch,
  updateBranchSector,
} from "../../services/companyService";

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
  const toast = useToast();
  const [unidades, setUnidades] = useState([]);
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
    return (
      unidades.reduce((maxId, unidade) => Math.max(maxId, unidade.id), 0) + 1
    );
  }, [unidades]);

  const nextSetorId = useMemo(() => {
    const allSetores = unidades.flatMap((unidade) => unidade.sectors);
    return (
      allSetores.reduce((maxId, setor) => Math.max(maxId, setor.id), 0) + 1
    );
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
      name: unidade.name,
      email: unidade.email,
      password: unidade.password,
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
      name: setor.name,
      email: setor.email,
      password: setor.password,
      quantidadeAlunos: String(setor.quantidadeAlunos),
    });
    setIsSetorModalOpen(true);
  };

  const closeSetorModal = () => {
    setIsSetorModalOpen(false);
    setEditingSetor(null);
    setSetorForm(emptySetorForm);
  };

  const handleSaveUnidade = async () => {
    if (!unidadeForm.name || !unidadeForm.email || !unidadeForm.password) {
      return;
    }
    try {
      if (editingUnidadeId) {
        const updateData = {
          name: unidadeForm.name,
          email: unidadeForm.email,
        };
        if (unidadeForm.password && unidadeForm.password !== "") {
          updateData.password = unidadeForm.password;
        }
        await updateBranch(editingUnidadeId, updateData);
      } else {
        await createBranch({
          name: unidadeForm.name,
          email: unidadeForm.email,
          password: unidadeForm.password,
        });
      }

      await fetchBranches();
      closeUnidadeModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  async function fetchBranches() {
    const res = await getBranches();
    setUnidades(res.data.data);
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSaveSetor = async () => {
    if (
      !setorForm.unidadeId ||
      !setorForm.name ||
      !setorForm.email ||
      !setorForm.password
    ) {
      return;
    }

    const selectedUnidadeId = Number(setorForm.unidadeId);
    const quantidadeAlunos = Number(setorForm.quantidadeAlunos) || 0;

    try {
      if (editingSetor) {
        const origemUnidadeId = editingSetor.unidadeId;
        const setorId = editingSetor.setorId;
        await updateBranchSector(origemUnidadeId, setorId, {
          name: setorForm.name,
          email: setorForm.email,
          password: setorForm.password,
        });
      } else {
        await createBranchSector(setorForm.unidadeId, {
          name: setorForm.name,
          email: setorForm.email,
          password: setorForm.password,
        });
      }
      setOpenRowId(selectedUnidadeId);
      await fetchBranches();
      closeSetorModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const openDeleteDialog = (target) => {
    setDeleteTarget(target);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.type === "unidade") {
        await deleteBranch(deleteTarget.unidadeId);

        if (openRowId === deleteTarget.unidadeId) {
          setOpenRowId(null);
        }
      }
      if (deleteTarget.type === "setor") {
        await deleteBranchSector(deleteTarget.unidadeId, deleteTarget.setorId);
      }
      fetchBranches();
      closeDeleteDialog();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
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
          <Button
            leftIcon={<MdAdd />}
            colorScheme="blue"
            onClick={openCreateUnidadeModal}
          >
            Criar unidade
          </Button>
          <Button
            variant="outline"
            leftIcon={<MdAdd />}
            onClick={() => openCreateSetorModal()}
          >
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
                        aria-label={
                          isOpen ? "Ocultar setores" : "Mostrar setores"
                        }
                        icon={
                          isOpen ? (
                            <MdKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleRow(unidade.id)}
                      />
                    </Td>
                    <Td>{unidade.name}</Td>
                    <Td>{unidade.email}</Td>
                    <Td>
                      <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                        {unidade.sectors?.length}
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
                    <Td
                      colSpan={5}
                      p={0}
                      borderBottom={isOpen ? "1px solid" : "0"}
                    >
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
                              {unidade.sectors.length > 0 ? (
                                unidade.sectors.map((setor) => (
                                  <Tr key={setor.id}>
                                    <Td>{setor.name}</Td>
                                    <Td>{setor.email}</Td>
                                    <Td>{setor.candidatesCount}</Td>
                                    <Td>
                                      <Flex gap={2}>
                                        <IconButton
                                          aria-label="Editar setor"
                                          icon={<MdEdit />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="blue"
                                          onClick={() =>
                                            openEditSetorModal(
                                              unidade.id,
                                              setor,
                                            )
                                          }
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
                                  <Td
                                    colSpan={4}
                                    textAlign="center"
                                    py={4}
                                    color="gray.500"
                                  >
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
                value={unidadeForm.name}
                onChange={(event) =>
                  setUnidadeForm((current) => ({
                    ...current,
                    name: event.target.value,
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
                value={unidadeForm.password}
                onChange={(event) =>
                  setUnidadeForm((current) => ({
                    ...current,
                    password: event.target.value,
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
          <ModalHeader>
            {editingSetor ? "Editar setor" : "Criar setor"}
          </ModalHeader>
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
                    {unidade.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={setorForm.name}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    name: event.target.value,
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
                value={setorForm.password}
                onChange={(event) =>
                  setSetorForm((current) => ({
                    ...current,
                    password: event.target.value,
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
