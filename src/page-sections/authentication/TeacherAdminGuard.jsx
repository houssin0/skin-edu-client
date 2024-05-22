import PropTypes from 'prop-types';
import useAuth from "hooks/useAuth";
import UnauthorizedPage from '../../pages/401';

const TeacherAdminGuard = props => {
  const { children } = props;
  const { user } = useAuth();

  if (user && (user.userType === 'admin' || user.userType === 'med_teacher')) {
    return children;
  }
 return <UnauthorizedPage />;
};

TeacherAdminGuard.propTypes = {
  children: PropTypes.node
};

export default TeacherAdminGuard;