import React from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { Button, HStack, Tooltip } from '@chakra-ui/react';
import { MdOutlineBlock, MdOutlineCheck } from 'react-icons/md';
import ViewCandidates from './ViewCandidates';
import { WithModal } from '../WithModal';
import { ModalConfirm } from '../WithModal/ModalConfirm';
import { handleCandidateJobUpdate, isLoading } from '../../store/ducks/jobs';
import { ModalForwardCandidate } from './ModalForwardCandidate';
import { CandidateJobStatus } from '../../utils/constants';

const CalledCandidates = ({
  job,
  status,
  isLoading,
  handleCandidateJobUpdate
}) => (
  <ViewCandidates
    actionColumns={({ records, setRecords }) => [
      {
        Header: 'Ações',
        filterable: false,
        Cell: ({
          row: {
            original: { id }
          }
        }) => {
          const newStatus = status + 1;
          return (
            <HStack spacing={2}>
              <WithModal
                modal={({ closeModal }) =>
                  newStatus === CandidateJobStatus.FORWARDED ? (
                    <ModalForwardCandidate
                      onConfirm={({ date, hour }) => {
                        handleCandidateJobUpdate({
                          job,
                          candidate: id,
                          status: newStatus,
                          date,
                          hour
                        }).then(() => {
                          setRecords(
                            update(records, {
                              $apply: (records) =>
                                records.filter((record) => record.id !== id)
                            })
                          );
                        });
                        closeModal();
                      }}
                      onCancel={closeModal}
                    />
                  ) : (
                    <ModalConfirm
                      text='Essa ação irá passar este candidato para próxima fase'
                      onConfirm={() => {
                        handleCandidateJobUpdate({
                          job,
                          candidate: id,
                          status: newStatus
                        }).then(() => {
                          setRecords(
                            update(records, {
                              $apply: (records) =>
                                records.filter((record) => record.id !== id)
                            })
                          );
                        });
                        closeModal();
                      }}
                      onCancel={closeModal}
                    />
                  )
                }
              >
                {({ toggleModal }) => (
                  <Tooltip hasArrow label='Passar para próxima fase'>
                    <Button
                      isLoading={isLoading}
                      size='xs'
                      onClick={toggleModal}
                      colorScheme='teal'
                    >
                      <MdOutlineCheck />
                    </Button>
                  </Tooltip>
                )}
              </WithModal>

              <WithModal
                modal={({ closeModal }) => (
                  <ModalConfirm
                    text='Essa ação irá reprovar este candidato'
                    onConfirm={() => {
                      handleCandidateJobUpdate({
                        job,
                        candidate: id
                      }).then(() =>
                        setRecords((records) =>
                          records.filter((record) => record.id !== id)
                        )
                      );
                      closeModal();
                    }}
                    onCancel={closeModal}
                  />
                )}
              >
                {({ toggleModal }) => (
                  <Tooltip hasArrow label='Reprovar candidato'>
                    <Button
                      isLoading={isLoading}
                      size='xs'
                      onClick={toggleModal}
                      colorScheme='red'
                    >
                      <MdOutlineBlock />
                    </Button>
                  </Tooltip>
                )}
              </WithModal>
            </HStack>
          );
        }
      }
    ]}
    job={job}
    status={status}
  />
);

const mapStateToProps = (state) => ({
  isLoading: isLoading(state)
});

export default connect(mapStateToProps, {
  handleCandidateJobUpdate
})(CalledCandidates);
