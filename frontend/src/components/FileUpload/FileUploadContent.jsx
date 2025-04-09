import React, { useState } from 'react';
import {
  Button,
  Divider,
  Input,
  ListItem,
  UnorderedList,
  Select
} from '@chakra-ui/react';

const AVAILABLE_TYPES = [
  { type: 'Contracts', label: 'Protocolo' },
  { type: 'Addendum', label: 'Adendo' },
  { type: 'School_Statement', label: 'Declação Escolar' },
  { type: 'Volunteering', label: 'Voluntariado' },
  { type: 'Evaluation_Closes', label: 'Ficha de Avaliação' },
  { type: 'CurriculumVitae', label: 'Curriculum Vitae (CV)' },
  { type: 'CoverLetter', label: 'Carta de Apresentação' },
  { type: 'Others', label: 'Outros' }
];

const FileUpload = ({ create, isLoading, types }) => {
  const [files, setFiles] = useState({});
  const [type, setType] = useState(null);

  const handleFileListChange = (event) => {
    setFiles(event.target.files);
  };

  const getSelectedFiles = () => {
    const content = [];

    for (const [, file] of Object.entries(files)) {
      content.push(<ListItem key={file.name}>{file.name}</ListItem>);
    }

    return content;
  };

  const getFormDataFiles = () => {
    const formData = new FormData();

    for (const [, file] of Object.entries(files)) {
      formData.append('files[]', file, file.name);
    }

    formData.append('type', type);
    return formData;
  };

  return (
    <>
      <Input type='file' multiple onChange={handleFileListChange} />

      <Select
        mt={2}
        placeholder='Selecione o tipo dos arquivos'
        onChange={(e) => setType(e.target.value)} value={type}
      >
        {AVAILABLE_TYPES.filter((type) => types.includes(type.type)).map(
          (type) => (
            <option value={type.type}>{type.label}</option>
          )
        )}
      </Select>

      <UnorderedList>{getSelectedFiles()}</UnorderedList>

      <Divider m={2} />
      <Button
        float='right'
        colorScheme='blue'
        isLoading={isLoading}
        type='button'
        onClick={() => create(getFormDataFiles())}
        disabled={!type}
      >
        Enviar arquivos
      </Button>
    </>
  );
};

export default FileUpload;
