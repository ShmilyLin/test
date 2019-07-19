import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { Subscription } from 'rxjs';

// Utils
import Listener, { ListenerKeys } from '../../../../utils/Listener';

// Store
import { GlobalInterface } from '../../store/state';
import TabsActions from '../../store/Tabs/actions';
import AddTabMenuActions from '../../store/AddTabMenu/actions';
import { RepositoryItem } from '../../store/Repositories/state';

// Models
import TabItem, { TabItemType } from '../../models/TabItem';

// CSS
import './AddTabMenu.scss';

interface AddTabMenuProps {
    state: {
        Repositories: {
            repositoriesList: RepositoryItem[];
        }
    };
    dispatch: (action: AnyAction) => void;
}

enum AddTabMenuBackgroundViewAnimationStatus {
    Hide,
    Showing,
    Show,
    Hiding,
}

interface AddTabMenuState {
    needShow: boolean;
    needHide: boolean;

    leftViewWidth: number;
    subSelectedIndex: number;
}


class AddTabMenu extends React.Component<AddTabMenuProps, AddTabMenuState> {
    public moveLeftView: boolean = false;

    constructor(props: AddTabMenuProps) {
        super(props);
        console.log('AddTabMenu', props);
        
        this.state = {
            needShow: false,
            needHide: false,

            leftViewWidth: 300,
            subSelectedIndex: 0,
        };

        this.backgroundViewAnimationEnd = this.backgroundViewAnimationEnd.bind(this);
        this.browserGitHubButtonClick = this.browserGitHubButtonClick.bind(this);
        this.contentViewHeaderMouseWheelEvent = this.contentViewHeaderMouseWheelEvent.bind(this);
        this.moveLineMouseDownEvent = this.moveLineMouseDownEvent.bind(this);
        this.moveLineMouseMoveEvent = this.moveLineMouseMoveEvent.bind(this);
        this.moveLineMouseUpEvent = this.moveLineMouseUpEvent.bind(this);

        this.ShowListener = Listener.on(ListenerKeys.ShowAddTabMenu, this.ShowAddtabMenuEvent.bind(this));
    }

    public ShowListener: Subscription;

    public isFirstShowAddTabMenu: boolean = true;
    
    public animationStatus: AddTabMenuBackgroundViewAnimationStatus = AddTabMenuBackgroundViewAnimationStatus.Hide;

    public componentWillUnmount() {
        this.ShowListener.unsubscribe();
    }

    public ShowAddtabMenuEvent() {
        this.setState({
            needShow: true,
            needHide: false,
        })
    }

    public backgroundViewAnimationEnd() {
        if (this.state.needShow && this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Showing) {
            this.animationStatus = AddTabMenuBackgroundViewAnimationStatus.Show;
            this.setState({
                needShow: false,
            });
        } else if (this.state.needHide && this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Hiding) {
            this.animationStatus = AddTabMenuBackgroundViewAnimationStatus.Hide;
            this.setState({
                needHide: false,
            });
            this.props.dispatch(AddTabMenuActions.HideAddTabMenu());
        }
    }

    public backgroundViewClickEvent() {
        this.setState({
            needShow: false,
            needHide: true,
        });
    }

    public browserGitHubButtonClick() {
        let newTabItem = new TabItem(TabItemType.GitHub, 'GitHub');
        this.props.dispatch(TabsActions.AddTabItem(newTabItem));
        Listener.done(ListenerKeys.AddATab, newTabItem);
        this.backgroundViewClickEvent();
    }

    public contentViewHeaderMouseWheelEvent(event: any) {
        if (event.nativeEvent.wheelDelta < 0) { // 向左
          let currentLeft = (this.refs['add-tab-menu-view-content-header'] as any).scrollLeft;
          (this.refs['add-tab-menu-view-content-header'] as any).scrollTo(currentLeft + 15, 0);
        } else if (event.nativeEvent.wheelDelta > 0) { // 向右
          let currentLeft = (this.refs['add-tab-menu-view-content-header'] as any).scrollLeft;
          if (currentLeft > 0 ) {
            (this.refs['add-tab-menu-view-content-header'] as any).scrollTo(currentLeft - 15, 0);
          }
        }
    }

    public moveLineMouseDownEvent(event: any) {
        this.moveLeftView = true;
    }

    public moveLineMouseMoveEvent(event: any) {
        if (this.moveLeftView) {
            let tempWidth = event.nativeEvent.x;
            if (tempWidth < 300) {
                tempWidth = 300;
            } else if (tempWidth > document.body.clientWidth - 20) {
                tempWidth = document.body.clientWidth - 20;
            }

            this.setState({
                leftViewWidth: tempWidth,
            })
        }
    }

    public moveLineMouseUpEvent(event: any) {
        if (this.moveLeftView) {
            let tempWidth = event.nativeEvent.x;
            if (tempWidth < 300) {
                tempWidth = 300;
            } else if (tempWidth > document.body.clientWidth - 20) {
                tempWidth = document.body.clientWidth - 20;
            }

            this.setState({
                leftViewWidth: tempWidth,
            })
        }

        this.moveLeftView = false;
        event.stopPropagation();
    }

    public render() {
        let backgroundViewClass = 'add-tab-menu';
        let contentViewClass = 'add-tab-menu-view';
        if (this.state.needShow) {
            if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Hide || this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Hiding) {
                this.animationStatus = AddTabMenuBackgroundViewAnimationStatus.Showing;
            }

            backgroundViewClass += ' add-tab-menu-showing';
            contentViewClass += ' add-tab-menu-view-showing';
        } else if (this.state.needHide) {
            if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Show || this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Showing) {
                this.animationStatus = AddTabMenuBackgroundViewAnimationStatus.Hiding;
            }

            backgroundViewClass += ' add-tab-menu-hiding';
            contentViewClass += ' add-tab-menu-view-hiding';
        } else {
            if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Hide) {
                
            } else if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Hiding) {
                backgroundViewClass += ' add-tab-menu-hiding';
                contentViewClass += ' add-tab-menu-view-hiding';
            } else if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Show) {
                backgroundViewClass += ' add-tab-menu-show';
                contentViewClass += ' add-tab-menu-view-show';
            } else if (this.animationStatus === AddTabMenuBackgroundViewAnimationStatus.Showing) {
                backgroundViewClass += ' add-tab-menu-showing';
                contentViewClass += ' add-tab-menu-view-showing';
            }
        }

        return (
            <div className={backgroundViewClass} 
                onAnimationEnd={this.backgroundViewAnimationEnd} 
                onClick={(e) => this.backgroundViewClickEvent()}
                onMouseMove={this.moveLineMouseMoveEvent} 
                onMouseUp={this.moveLineMouseUpEvent}
                onMouseLeave={this.moveLineMouseUpEvent}>
                <div className={contentViewClass} 
                    style={{
                        width: this.state.leftViewWidth + 'px',
                    }} 
                    onClick={(e) => e.stopPropagation()}>
                    <div className="add-tab-menu-view-header">
                        <div className="add-tab-menu-view-header-item" onClick={this.browserGitHubButtonClick}>
                            <div className="add-tab-menu-view-header-item-title">浏览GitHub</div>
                            <div className="add-tab-menu-view-header-item-icon"></div>
                        </div>
                    </div>
                    <div className="add-tab-menu-view-content">
                        <div className="add-tab-menu-view-content-header" 
                            ref="add-tab-menu-view-content-header" 
                            onWheel={(e) => this.contentViewHeaderMouseWheelEvent(e)}>
                            <div className={"add-tab-menu-view-content-header-item" + (this.state.subSelectedIndex === 0 ? ' add-tab-menu-view-content-header-item-selected' : '')}>最近</div>
                            <div className={"add-tab-menu-view-content-header-item" + (this.state.subSelectedIndex === 1 ? ' add-tab-menu-view-content-header-item-selected' : '')}>所有</div>
                            <div className={"add-tab-menu-view-content-header-item" + (this.state.subSelectedIndex === 2 ? ' add-tab-menu-view-content-header-item-selected' : '')}>收藏</div>
                            <div className={"add-tab-menu-view-content-header-item" + (this.state.subSelectedIndex === 3 ? ' add-tab-menu-view-content-header-item-selected' : '')}>我的GitHub</div>
                            <div className={"add-tab-menu-view-content-header-item" + (this.state.subSelectedIndex === 4 ? ' add-tab-menu-view-content-header-item-selected' : '')}>GitHub关注</div>
                        </div>
                        <div className="add-tab-menu-view-content-list">
                            {
                                this.props.state.Repositories.repositoriesList.length > 0 ? 
                                    <div className="add-tab-menu-view-content-list-item"></div> : 
                                    <div className="add-tab-menu-view-content-list-none">还没有添加任何仓库哦</div>
                            }
                        </div>
                    </div>
                    <div className="add-tab-menu-view-line" 
                        onMouseDown={this.moveLineMouseDownEvent} 
                        onClick={(e) => e.stopPropagation()}></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterface) => ({
    state: {
        Repositories: {
            repositoriesList: state.Repositories.repositoriesList,
        }
    }
});

export default connect(mapStateToProps)(AddTabMenu);
