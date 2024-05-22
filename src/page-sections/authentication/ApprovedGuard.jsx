import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import NotYetApproved from '../../pages/authentication/Not-yet-approved';

const ApprovedGuard = ({ children }) => {
  const { user } = useAuth();

  if (user && user.is_approved ) {
    return children;
  }

  return <NotYetApproved />;
};

ApprovedGuard.propTypes = {
  children: PropTypes.node
};

export default ApprovedGuard;
