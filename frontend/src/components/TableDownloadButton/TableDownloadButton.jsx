import React from 'react';
import { Button, Link, Tooltip } from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

const TableDownloadButton = ({ resource }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  let url = `${import.meta.env.VITE_BACKEND_BASE_URL}/download/${resource}`;

  let filters = searchParams.get('filterFields');
  if (searchParams) {
    url += `?filterFields=${filters}`;
  }

  return (
    <Tooltip
      hasArrow
      label='Fazer download dos dados'
      shouldWrapChildren
      mt='3'
    >
      <Link disabled mr={2} target='_blank' href={url}>
        <Button title='Download' colorScheme='teal' variant='outline'>
          <MdDownload />
        </Button>
      </Link>
    </Tooltip>
  );
};

export default TableDownloadButton;
