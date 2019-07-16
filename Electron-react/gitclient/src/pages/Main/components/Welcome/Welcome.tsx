import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// CSS
import './Welcome.scss';

interface WelcomeProps {
    dispatch: (action: AnyAction) => void;
}

class Welcome extends React.Component<WelcomeProps> {
    constructor(props: WelcomeProps) {
        super(props);
        console.log('Welcome', props);
        
        // this.state = {

        // };
    }

    public componentWillUnmount() {
        
    }

    public render() {
        return (
            <div className="welcome">
                
            </div>
        );
    }
}


export default connect()(Welcome);
