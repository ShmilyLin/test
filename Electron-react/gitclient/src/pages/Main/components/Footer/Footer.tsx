import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// CSS
import './Footer.scss';

interface FooterProps {
    dispatch: (action: AnyAction) => void;
}

class Footer extends React.Component<FooterProps> {
    constructor(props: FooterProps) {
        super(props);
        console.log('Footer', props);
        
        // this.state = {

        // };
    }

    public componentWillUnmount() {
        
    }

    public render() {
        return (
            <div className="footer">
                
            </div>
        );
    }
}


export default connect()(Footer);
