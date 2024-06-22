import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/JWTAuth';

const RoleBasedRedirect = () => {
  const { user } = useContext(AuthContext);

  if (user.userType === 'admin') {
    return <Navigate to="/dashboard/app" replace />;
  } else if (user.userType === 'med_teacher') {
    return <Navigate to="/dashboard/teacher-app" replace />;
  } else if (user.userType === 'med_student') { 
    return <Navigate to="/dashboard" replace />; 
  }
  else {
    return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;