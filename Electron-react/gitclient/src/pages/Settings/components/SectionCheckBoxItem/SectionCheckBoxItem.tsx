import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// CSS
import './SectionCheckBoxItem.scss';

interface SectionCheckBoxItemProps {
    checked: boolean;
    title: string;
    desc?: string;
    onCheckChange: (checked: boolean) => void;
    dispatch: (action: AnyAction) => void;
}

class SectionCheckBoxItem extends React.Component<SectionCheckBoxItemProps> {
    constructor(props: SectionCheckBoxItemProps) {
        super(props);
        console.log('SectionCheckBoxItem', props);
        
        this.checkBoxClick = this.checkBoxClick.bind(this);
    }

    public checkBoxClick() {
        this.props.onCheckChange(!this.props.checked);
    }

    public render() {
        return (
            <div className="scbi">
                <div className={'scbi-check' + (this.props.checked ? ' scbi-checked' : '')} onClick={this.checkBoxClick}></div>
                <div className="scbi-content">
                    <div className="scbi-content-title" onClick={this.checkBoxClick}>{this.props.title}</div>
                    {this.props.desc && 
                        <div className="scbi-content-desc">{this.props.desc}</div>
                    }
                </div>
            </div>
        );
    }
}


export default connect()(SectionCheckBoxItem);
