import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// Store
import { GlobalInterfaceBase } from '../../store/state';
import { CommonModalInterface } from '../../store/Common/state';
import CommonActions from '../../store/Common/actions';

// CSS
import './Modal.scss';



interface ModalProps {
    state: {
        Common: {
            modal: CommonModalInterface;
        }
    }
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
        if (this.props.state.Common.modal.success) {
            this.props.state.Common.modal.success({
                confirm: false,
                cancel: true,
            })
        }
        this.props.dispatch(CommonActions.HideModal());
    }
    
    public confirmButtonClick() {
        if (this.props.state.Common.modal.success) {
            this.props.state.Common.modal.success({
                confirm: true,
                cancel: false,
            })
        }
        this.props.dispatch(CommonActions.HideModal());
    }

    public render() {
        return (
            <div className="modal" style={{
                display: this.props.state.Common.modal.show ? '' : 'none'
            }}>
                <div className="modal-view">
                    <div className="modal-view-content">
                        <div className="modal-view-content-icon"></div>
                        <div className="modal-view-content-text">
                            <div className="modal-view-content-text-title">{this.props.state.Common.modal.title}</div>
                            {this.props.state.Common.modal.content && 
                                <div className="modal-view-content-text-content">{this.props.state.Common.modal.content}</div>
                            }
                        </div>
                    </div>
                    <div className="modal-view-actions">
                        {this.props.state.Common.modal.showCancel &&
                            <div className="modal-view-actions-cancel" onClick={this.cancelButtonClick}>{this.props.state.Common.modal.cancelText}</div>
                        }
                        <div className="modal-view-actions-confirm" onClick={this.confirmButtonClick}>{this.props.state.Common.modal.confirmText}</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterfaceBase) => ({
    state: {
      Common: {
          modal: state.Common.modal
      },
    }
});

export default connect(mapStateToProps)(Modal);
