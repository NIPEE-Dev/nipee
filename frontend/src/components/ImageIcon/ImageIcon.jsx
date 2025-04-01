import React from 'react';
import {
  RiImage2Line,
  RiFilePdfLine,
  RiFileUnknowLine,
  RiFileGifLine,
  RiFilePpt2Line,
  RiFileWord2Line,
  RiFileExcel2Line,
} from 'react-icons/ri';

const ImageIcon = ({ fileExtension }) => {
  const extension = {
    img: <RiImage2Line />,
    pdf: <RiFilePdfLine />,
    gif: <RiFileGifLine />,
    ppt: <RiFilePpt2Line />,
    docx: <RiFileWord2Line />,
    xls: <RiFileExcel2Line />,
    xlsx: <RiFileExcel2Line />,
  };

  return extension[fileExtension] || <RiFileUnknowLine />;
};

export default ImageIcon;
