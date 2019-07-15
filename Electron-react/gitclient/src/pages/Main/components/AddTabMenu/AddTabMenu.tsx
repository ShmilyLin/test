import React from 'react';
import { connect } from 'react-redux';
import { GlobalInterface } from '../../store/state';
import { AnyAction } from 'redux';
import AddTabMenuActions from '../../store/AddTabMenu/actions';
import './AddTabMenu.scss';
import Listener, { ListenerKeys } from '../../utils/Listener';
import { Subscription } from 'rxjs';
import { RepositoryItem } from '../../store/Repositories/state';

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
}


class AddTabMenu extends React.Component<AddTabMenuProps, AddTabMenuState> {
    constructor(props: AddTabMenuProps) {
        super(props);
        console.log('AddTabMenu', props);
        
        this.state = {
            needShow: false,
            needHide: false,
        };

        this.backgroundViewAnimationEnd = this.backgroundViewAnimationEnd.bind(this);

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

    public backgroundViewClickEvent(event: any) {
        console.log(event);
        this.setState({
            needShow: false,
            needHide: true,
        });
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
                onClick={(e) => this.backgroundViewClickEvent(e)}>
                <div className={contentViewClass} onClick={(e) => e.stopPropagation()}>
                    <div className="add-tab-menu-view-header">
                        <div className="add-tab-menu-view-header-item">
                            <div className="add-tab-menu-view-header-item-title">浏览GitHub</div>
                            <div className="add-tab-menu-view-header-item-icon"></div>
                        </div>
                    </div>
                    <div className="add-tab-menu-view-content">
                        <div className="add-tab-menu-view-content-header">

                        </div>
                        <div className="add-tab-menu-view-content-list">
                            {
                                this.props.state.Repositories.repositoriesList.length > 0 ? 
                                    <div className="add-tab-menu-view-content-list-item"></div> : 
                                    <div className="add-tab-menu-view-content-list-none">还没有添加任何仓库哦</div>
                            }
                        </div>
                    </div>
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
