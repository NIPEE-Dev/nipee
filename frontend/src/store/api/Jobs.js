import createResourceApi from '../utils/createResourceApi';
import api from '../../api';

export default createResourceApi('jobs', {
  callCandidates({ jobs, candidates }) {
    return api.post('jobs/candidates/call', { jobs, candidates });
  },
  changeStatus(data) {
    return api.put('jobs/candidates/update-status', data);
  }
});
