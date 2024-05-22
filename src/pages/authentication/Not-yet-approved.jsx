import React from "react";
import "./NotYetApproved.css"; // Import your CSS file for additional styling
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useTheme } from '@mui/material';

const NotYetApproved = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="not-approved-container">
      <img
        src="/static/illustration/not-approved.svg"
        alt="Account Not Approved Illustration"
        className="not-approved-image"
      />
      <div className="not-approved-content">
        <h1>Your account is not yet approved</h1>
        <p>Please wait for admin approval.</p>

        <button
          onClick={handleLogout}
          style={{
            borderRadius: '50px',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          Log out
        </button>      </div>
    </div>
  );
};

export default NotYetApproved;