import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// State
import { GlobalInterface } from '../../store/state';

// CSS
import './GitHubView.scss';
import TabItem from '../../models/TabItem';

interface GitHubViewProps {
    tabItem: TabItem;
    tabIndex: number;
    state: {
        Tabs: {
          currentShowIndex: number;
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

    public componentWillUnmount() {
        
    }

    public render() {
        return (
            <div className="ghv" style={{
                display: this.props.tabIndex === this.props.state.Tabs.currentShowIndex ? 'block' : 'none',
            }}>
                GitHub {this.props.tabIndex}
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterface) => ({
    state: {
      Tabs: {
        currentShowIndex: state.Tabs.currentShowIndex,
      }
    }
});

export default connect(mapStateToProps)(GitHubView);
