import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// Components
import GitHubView from '../GitHub/GitHubView/GitHubView';
import Welcome from '../Welcome/Welcome';

// State
import { GlobalInterface } from '../../store/state';

// Models
import TabItem, { TabItemType } from '../../models/TabItem';

// CSS
import './Content.scss';


interface ContentProps {
    state: {
        Tabs: {
            fixedList: TabItem[],
            openList: TabItem[],
            currentShowIndex: number,
        };
    };
    dispatch: (action: AnyAction) => void;
}

class Content extends React.Component<ContentProps> {
    constructor(props: ContentProps) {
        super(props);
        console.log('Footer', props);
        
        // this.state = {

        // };
    }

    public componentWillUnmount() {
        
    }

    public render() {
        let tempList: TabItem[] = (new Array<TabItem>()).concat(this.props.state.Tabs.fixedList, this.props.state.Tabs.openList);
        return (
            <div className="content">
                {tempList.map((tabItem, tabIndex) => {
                    if (tabItem.type === TabItemType.Repository) {

                    } else if (tabItem.type === TabItemType.GitHub) {
                        console.log(tabIndex, tabItem.createTime);
                        return <GitHubView tabItem={tabItem} tabIndex={tabIndex} key={'github_' + tabItem.createTime}/>;
                    }

                    return <Welcome key={'welcome_' + tabItem.createTime}/>;
                })}
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

export default connect(mapStateToProps)(Content);
