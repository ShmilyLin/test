import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { GlobalInterface } from '../../store/state';
import { RepositoryItem } from '../../store/Repositories/state';
import Listener, { ListenerKeys } from '../../utils/Listener';
// import AddTabMenuActions from '../../store/AddTabMenu/actions';
import './Navigation.scss';

const {
  Menu,
  // MenuItem,
} = window.require('electron').remote;

interface NavigationProps {
  state: {
    Tabs: {
      fixedList: RepositoryItem[],
      openList: RepositoryItem[],
    };
  };
  dispatch: (action: AnyAction) => void;
}

class Navigation extends React.Component<NavigationProps> {
  constructor(props: NavigationProps) {
    super(props);

    console.log('Navigation', props);

    this.newRepositoryButtonClick = this.newRepositoryButtonClick.bind(this);
    this.addTabButtonClick = this.addTabButtonClick.bind(this);
  }

  public newRepositoryButtonClick() {
    let tempMenu = Menu.buildFromTemplate([{
      label: '从URL克隆仓库',
      click: () => {
        
      },
    }, {
      type: 'separator',
    }, {
      label: '创建一个新的远程仓库',
      click: () => {
        
      },
    }, {
      type: 'separator',
    }, {
      label: '添加本地已存在的仓库',
      click: () => {

      }
    }, {
      label: '创建一个新的本地仓库',
      click: () => {

      }
    }]);
    tempMenu.popup({
      x: 80,
      y: 44,
    });
  }

  public addTabButtonClick() {
    // this.props.dispatch(AddTabMenuActions.ShowAddTabMenu());
    Listener.done(ListenerKeys.ShowAddTabMenu);
  }

  public render() {
    return (
      <div className="navigation">
        <div className="navigation-left" onClick={this.newRepositoryButtonClick}>
          <div className="navigation-left-icon"></div>
        </div>
        <div className="navigation-list">
          {this.props.state.Tabs.openList.map((repoItem) => 
            <div className="navigation-list-item">
              <div className="navigation-list-item-title">{repoItem.title}</div>
              <div className="navigation-list-item-close"></div>
            </div>
          )}
        </div>
        <div className="navigation-right" onClick={this.addTabButtonClick}>
          <div className="navigation-right-icon"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalInterface) => ({
  state: {
    Tabs: {
      fixedList: state.Tabs.fixedList,
      openList: state.Tabs.openList,
    }
  }
});

export default connect(mapStateToProps)(Navigation);
