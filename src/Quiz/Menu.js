
import React from 'react';
import TopNav from './topnav'; 

function Menu() {
  const styles = {
    menu: {
      backgroundColor: '#fff',
      padding: '20px',
      color: '#054e80',
      display: 'flex',
      
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuItem: {
      margin: '0 15px',
      cursor: 'pointer',
    },
    logo: {
      width:'180px',
      height: '100px', 
      cursor: 'pointer',
    }
  };

  return (
    <><TopNav /> 
    <nav style={styles.menu}>

        <div>
          <span style={styles.menuItem}></span>
          <span style={styles.menuItem}></span>
          <span style={styles.menuItem}></span>
        </div>
        <img src={'./fmpc.jpg'} alt="Logo" style={styles.logo} />
        <div>
          <span style={styles.menuItem}></span>
          <span style={styles.menuItem}></span>
        </div>
      </nav></>
  );
}

export default Menu;
