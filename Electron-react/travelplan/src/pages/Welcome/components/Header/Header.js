import React from 'react';
import StatusBar from '../StatusBar/StatusBar.js';

class Header extends React.Component {
    render() {
      return (
          <div className="header">
              <StatusBar></StatusBar>
              <div className="header-content">
                  
              </div>
          </div>
      );
    }
}

export default Header;