import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
// import axios from 'axios';

import GitHubRouteList from '../../../data/GitHubRouteList';
// State
import { GlobalInterface } from '../../../store/state';

// Models
import TabItem from '../../../models/TabItem';

// Components
import GitHubSignIn from '../GitHubSignIn/GitHubSignIn';

// CSS
import './GitHubView.scss';

// Nodejs
// var http = require('https');

interface GitHubViewProps {
    tabItem: TabItem;
    tabIndex: number;
    state: {
        Tabs: {
          currentShowIndex: number;
        };
        User: {
            github: {
                loggedin: boolean;
            };
        };
    };
    dispatch: (action: AnyAction) => void;
}

class GitHubView extends React.Component<GitHubViewProps> {
    constructor(props: GitHubViewProps) {
        super(props);
        console.log('Footer', props);
        
        // this.state = {

        // };
    }

    public componentDidMount() {
        
    }

    public componentWillUnmount() {
        
    }

    public render() {
        let ContentList = [];
        for (let i = 0; i < this.props.tabItem.github!.routeList.length; i++) {
            let tempRouteItem = this.props.tabItem.github!.routeList[i];

            switch (tempRouteItem.name) {
                case GitHubRouteList.SignIn:
                    ContentList.push(<GitHubSignIn key={tempRouteItem.createTime} $route={tempRouteItem} isLast={i === this.props.tabItem.github!.routeList.length - 1}/>);
                    break;
            }
            
        }
        return (
            <div className="ghv" style={{
                display: this.props.tabIndex === this.props.state.Tabs.currentShowIndex ? 'block' : 'none',
            }}>
                <div className="ghv-header">
                    <div className="ghv-header-back">
                        <div className="ghv-header-back-icon"></div>
                    </div>
                    <div className="ghv-header-home">
                        <div className="ghv-header-home-icon"></div>
                    </div>
                    <div className="ghv-header-search">
                        <div className="ghv-header-search-icon"></div>
                        <div className="ghv-header-search-type">
                            <div className="ghv-header-search-type-content">Repositories</div>
                        </div>
                        <div className="ghv-header-search-content">
                            <input type="text" placeholder="Search GitHub"/>
                        </div>
                    </div>
                </div>
                {/* {(() => {
                    if (this.props.state.User.github.loggedin) {
                        return <div className="ghv-content"></div>
                    } else {
                        return <GitHubSignIn />;
                    }
                })()} */}
                {ContentList}
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterface) => ({
    state: {
        Tabs: {
            currentShowIndex: state.Tabs.currentShowIndex,
        },
        User: {
            github: {
                loggedin: state.User.github.loggedin,
            }
        }
    }
});

export default connect(mapStateToProps)(GitHubView);
