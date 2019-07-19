import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';


// CSS
import './Common.scss';

interface CommonProps {
    show: boolean;
    dispatch: (action: AnyAction) => void;
}

interface CommonState {
    ui: {
        showStatus: number;
    };
}

class Common extends React.Component<CommonProps, CommonState> {
    constructor(props: CommonProps) {
        super(props);
        console.log('Common', props);

        this.state = {
            ui: {
                showStatus: 0,  
            },
        }

        this.sectionItemHeaderClick = this.sectionItemHeaderClick.bind(this);
        this.sectionItemContentShowAnimationEndEvent = this.sectionItemContentShowAnimationEndEvent.bind(this);
    }

    public sectionItemHeaderClick(index: number) {
        
    }

    public sectionItemContentShowAnimationEndEvent(index: number) {

    }

    public render() {
        return (
            <div className="common" style={{
                display: this.props.show ? '' : 'none',
            }}>
                <div className="common-section">
                    <div className={"common-section-header" + ((this.state.ui.showStatus === 0 || this.state.ui.showStatus === 1) ? '' : ' common-section-header-hide')} 
                        onClick={() => this.sectionItemHeaderClick(0)}>
                        <div className="common-section-header-icon"></div>
                        <div className="common-section-header-title">界面</div>
                    </div>
                    <div className={'common-section-content' + (this.state.ui.showStatus === 0 ? 
                            '' 
                            : (this.state.ui.showStatus === 1 ? 
                                'common-section-content-showing' 
                                : (this.state.ui.showStatus === 2 ? 
                                    'common-section-content-hide' 
                                    : 'common-section-content-hiding'
                                )
                            )
                        )} 
                        onAnimationEnd={() => this.sectionItemContentShowAnimationEndEvent(0)}>
                        
                    </div>
                </div>
            </div>
        );
    }
}


export default connect()(Common);
