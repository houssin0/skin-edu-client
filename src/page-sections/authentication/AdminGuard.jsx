import PropTypes from 'prop-types';
import useAuth from "hooks/useAuth";
import UnauthorizedPage from '../../pages/401';

const AdminGuard = props => {
  const { children } = props;
  const { user } = useAuth();

  if (user && user.userType === 'admin') {
    return children;
  }
 
  return <UnauthorizedPage />;
};

AdminGuard.propTypes = {
  children: PropTypes.node
};

export default AdminGuard;