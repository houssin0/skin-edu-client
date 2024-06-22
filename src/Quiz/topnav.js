// src/pages/TopNav.js
import React from 'react';

function TopNav() {
  const styles = {
    topNav: {
      backgroundImage: `linear-gradient(to right, #2682c399, #4a6494b8), url('https://manon.qodeinteractive.com/wp-content/uploads/2019/01/home-8-rev-img-1.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    topNavItem: {
      margin: '0 15px',
      cursor: 'pointer',
    }
  };

  return (
    <nav style={styles.topNav}>

    </nav>
  );
}

export default TopNav;
