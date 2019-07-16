import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { GlobalInterface } from '../../store/state';
import TabItem, { TabItemType } from '../../models/TabItem';
import Listener, { ListenerKeys } from '../../utils/Listener';
// import AddTabMenuActions from '../../store/AddTabMenu/actions';
import './Navigation.scss';
import TabsActions from '../../store/Tabs/actions';

const {
  Menu,
  // MenuItem,
} = window.require('electron').remote;

interface NavigationProps {
  state: {
    Tabs: {
      fixedList: TabItem[];
      openList: TabItem[];
      currentShowIndex: number;
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
    this.openListTabItemClick = this.openListTabItemClick.bind(this);
    this.navigationListMouseWheelEvent = this.navigationListMouseWheelEvent.bind(this);
    this.openListTabItemDeleteClick = this.openListTabItemDeleteClick.bind(this);
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

  public openListTabItemClick(index: number) {
    let tempIndex = index + this.props.state.Tabs.fixedList.length;
    if (tempIndex !== this.props.state.Tabs.currentShowIndex) {
      this.props.dispatch(TabsActions.ChangeCurrentIndex(tempIndex));
    }
  }

  public openListTabItemRightClick(index: number) {
    let tempItem = this.props.state.Tabs.openList[index];

    // if (tempItem.type === TabItemType.Repository) {

    // } else if (tempItem.type === TabItemType.GitHub) {

    // }

    let tempMenu = Menu.buildFromTemplate([{
      label: '关闭这个标签页',
      click: () => {
        this.openListTabItemDeleteClick(index);
      },
    }, {
      label: '关闭其他标签页',
      click: () => {
        
      },
    }, {
      label: '关闭右侧标签页',
      click: () => {
        
      },
    }, {
      label: '关闭所有标签页',
      click: () => {
        
      },
    }, {
      type: 'separator',
    }, {
      label: tempItem.isFixed ? '取消固定这个标签页' : '固定这个标签页',
      click: () => {
        
      },
    }]);
    tempMenu.popup();
  }

  public openListTabItemDeleteClick(index: number) {
    let tempIndex = index + this.props.state.Tabs.fixedList.length;
    this.props.dispatch(TabsActions.DeleteTabItem(tempIndex));
  }

  public navigationListMouseWheelEvent(event: any) {
    if (event.nativeEvent.wheelDelta < 0) { // 向左
      let currentLeft = (this.refs['navigation-list'] as any).scrollLeft;
      (this.refs['navigation-list'] as any).scrollTo(currentLeft + 15, 0);
    } else if (event.nativeEvent.wheelDelta > 0) { // 向右
      let currentLeft = (this.refs['navigation-list'] as any).scrollLeft;
      if (currentLeft > 0 ) {
        (this.refs['navigation-list'] as any).scrollTo(currentLeft - 15, 0);
      }
    }
  }

  public render() {
    let openListCurrentIndex = this.props.state.Tabs.currentShowIndex - this.props.state.Tabs.fixedList.length;
    return (
      <div className="navigation">
        <div className="navigation-left" onClick={this.newRepositoryButtonClick}>
          <div className="navigation-left-icon"></div>
        </div>
        <div className="navigation-fixed">
          {this.props.state.Tabs.fixedList.map((fixedItem, fixedIndex) => 
            <React.Fragment key={fixedItem.createTime}>
              <div className={'navigation-fixed-line' + ((this.props.state.Tabs.currentShowIndex === fixedIndex || this.props.state.Tabs.currentShowIndex + 1 === fixedIndex) ? ' navigation-fixed-line-hide' : '')}></div>
              <div className=""></div>
            </React.Fragment>
          )}
        </div>
        <div className="navigation-list" 
          style={{
            maxWidth: 'calc(100% - 36px - 36px)',
          }} 
          ref="navigation-list"
          onWheel={(e) => this.navigationListMouseWheelEvent(e)}>
          {this.props.state.Tabs.openList.map((repoItem, repoIndex) => 
            <React.Fragment key={repoItem.createTime}>
              <div className={'navigation-list-line' + ((openListCurrentIndex === repoIndex || openListCurrentIndex + 1 === repoIndex) ? ' navigation-list-line-hide' : '')}></div>
              <div className={'navigation-list-item' + (openListCurrentIndex === repoIndex ? ' navigation-list-item-show' : '')} 
                onClick={(e) => this.openListTabItemClick(repoIndex)} onContextMenu={() => this.openListTabItemRightClick(repoIndex)}>
                <div className="navigation-list-item-info">
                  {(() => {
                    if (repoItem.type === TabItemType.Repository) {
                      return <div className="navigation-list-item-info-icon-repo"></div>
                    } else if (repoItem.type === TabItemType.GitHub) {
                      return <div className="navigation-list-item-info-icon-github"></div>
                    }
                    
                    return null;
                  })()}
                  <div className="navigation-list-item-info-title">{repoItem.title}</div>
                </div>
                <div className="navigation-list-item-close" onClick={(e) => this.openListTabItemDeleteClick(repoIndex)}></div>
              </div>
            </React.Fragment>
          )}
          <div className={'navigation-list-line' + ((this.props.state.Tabs.openList.length + this.props.state.Tabs.fixedList.length === 0 || openListCurrentIndex + 1 === this.props.state.Tabs.openList.length + this.props.state.Tabs.fixedList.length) ? ' navigation-list-line-hide' : '')}></div>
        </div>
        <div className="navigation-right" title="打开一个新的标签页" onClick={this.addTabButtonClick}>
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
      currentShowIndex: state.Tabs.currentShowIndex,
    }
  }
});

export default connect(mapStateToProps)(Navigation);
