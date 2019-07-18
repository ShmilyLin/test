import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// CSS
import './Modal.scss';

interface ModalProps {
    title: string;
    content: string|undefined;
    showCancel: boolean;
    cancelText: string;
    confirmText: string;
    onHide: (res: {
        confirm: boolean;
        cancel: boolean;
    }) => void;
    dispatch: (action: AnyAction) => void;
}

class Modal extends React.Component<ModalProps> {
    constructor(props: ModalProps) {
        super(props);
        console.log('Modal', props);
        
        this.cancelButtonClick = this.cancelButtonClick.bind(this);
        this.confirmButtonClick = this.confirmButtonClick.bind(this);
    }

    public cancelButtonClick() {
        this.props.onHide({
            confirm: false,
            cancel: true,
        });
    }
    
    public confirmButtonClick() {
        this.props.onHide({
            confirm: true,
            cancel: false,
        });
    }

    public render() {
        return (
            <div className="modal">
                <div className="modal-view">
                    <div className="modal-view-content">
                        <div className="modal-view-content-icon"></div>
                        <div className="modal-view-content-text">
                            <div className="modal-view-content-text-title">{this.props.title}</div>
                            {this.props.content && 
                                <div className="modal-view-content-text-content">{this.props.content}</div>
                            }
                        </div>
                    </div>
                    <div className="modal-view-actions">
                        {this.props.showCancel &&
                            <div className="modal-view-actions-cancel" onClick={this.cancelButtonClick}>{this.props.cancelText}</div>
                        }
                        <div className="modal-view-actions-confirm" onClick={this.confirmButtonClick}>{this.props.confirmText}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Modal);
