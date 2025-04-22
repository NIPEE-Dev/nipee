import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { BaseRecordsForm as Form } from '../../forms/BaseRecordsForm/BaseRecordsForm';
import routes from '../../routes';
import SignaturePad from '../../components/SignaturePad/SignaturePad';

const BaseRecordsPage = () => (
  <SignaturePad documentId={50} onSuccess={null}></SignaturePad>
);

export default BaseRecordsPage;
