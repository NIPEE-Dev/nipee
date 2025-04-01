import api from '../../api';
import createResourceApi from '../utils/createResourceApi';

export default createResourceApi('contracts', {
  fetchContractData({ job, candidate }) {
    return api.get(`contracts/job/${job}/candidate/${candidate}`);
  },
});
