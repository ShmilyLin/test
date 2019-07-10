import React from 'react';
import './Navigation.scss';
import storage from '../../utils/Storage';

const Navigation: React.FC = (argument) => {
  console.log('Navigation', argument);
  let openList = storage.openList;

  return (
    <div className="navigation">
      <div className="navigation-left">
        <div className="navigation-left-icon"></div>
      </div>
      <div className="navigation-list">
        {openList.map((repoItem) => 
          <div className="navigation-list-item">
            <div className="navigation-list-item-title">{repoItem.title}</div>
            <div className="navigation-list-item-close"></div>
          </div>
        )}
      </div>
      <div className="navigation-right">
        <div className="navigation-right-icon"></div>
      </div>
    </div>
  );
}

export default Navigation;
