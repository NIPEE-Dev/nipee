import { connect } from 'react-redux';
import { isAuthenticated, permissions, profile } from '../ducks/auth';

const Auth = ({ isAuthenticated, profile, permissions, children }) =>
  children({
    isAuthenticated,
    profile,
    permissions,
  });

const mapStateToProps = (state) => ({
  isAuthenticated: isAuthenticated(state),
  profile: profile(state),
  permissions: permissions(state),
});

export default connect(mapStateToProps)(Auth);
