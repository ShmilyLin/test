import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// Components
import SectionCheckBoxItem from '../SectionCheckBoxItem/SectionCheckBoxItem';

// Store
import { GlobalInterface } from '../../store/state';
import { SettingsInterface } from '../../../../store/Settings/state';

// CSS
import './Common.scss';


interface CommonProps {
    show: boolean;
    state: {
        Settings: SettingsInterface,
    };
    dispatch: (action: AnyAction) => void;
}

interface CommonState {
    ui: {
        showStatus: number;
        show: boolean;
    };
}

class Common extends React.Component<CommonProps, CommonState> {
    constructor(props: CommonProps) {
        super(props);
        console.log('Common', props);

        this.state = {
            ui: {
                showStatus: 0,  
                show: true,
            },
        }

        this.sectionItemHeaderClick = this.sectionItemHeaderClick.bind(this);
        this.sectionItemContentShowAnimationEndEvent = this.sectionItemContentShowAnimationEndEvent.bind(this);
    }

    public sectionItemHeaderClick(index: number) {
        
    }

    public sectionItemContentShowAnimationEndEvent(index: number) {

    }

    public saveWindowSizeCheckChangeEvent(checked: boolean) {

    }

    public render() {
        return (
            <div className="common" style={{
                display: this.props.show ? '' : 'none',
            }}>
                <div className="common-section">
                    <div className={"common-section-header" + (this.state.ui.show ? '' : ' common-section-header-hide')} 
                        onClick={() => this.sectionItemHeaderClick(0)}>
                        <div className="common-section-header-icon"></div>
                        <div className="common-section-header-title">界面</div>
                    </div>
                    <div className="common-section-content" style={{
                        height: this.state.ui.show ? '300px' : '0px',
                        opacity: this.state.ui.show ? 1 : 0,
                    }}>
                        <SectionCheckBoxItem 
                            checked={this.props.state.Settings.common.saveWindowSize} 
                            title='是否恢复上次退出时窗口的大小' 
                            onCheckChange={this.saveWindowSizeCheckChangeEvent} />
                        <div className={'common-section-content-ui-account' + (this.props.state.Settings.common.saveWindowSize ? '' : ' common-section-content-ui-account-disable')}>
                            <div className="common-section-content-ui-account-desc">默认窗口大小</div>
                            <div className="common-section-content-ui-account-item">
                                <div className="common-section-content-ui-account-item-title">窗口默认宽度：</div>
                                <div className="common-section-content-ui-account-item-input">
                                    <input type="text" 
                                        placeholder="最小为800" 
                                        disabled={this.props.state.Settings.common.saveWindowSize}
                                        value={this.props.state.Settings.common.windowDefaultWidth}/>
                                </div>
                                <div className="common-section-content-ui-account-item-unit">像素</div>
                            </div>
                            <div className="common-section-content-ui-account-item">
                                <div className="common-section-content-ui-account-item-title">窗口默认高度：</div>
                                <div className="common-section-content-ui-account-item-input">
                                    <input type="text" 
                                        placeholder="最小为600" 
                                        disabled={this.props.state.Settings.common.saveWindowSize}
                                        value={this.props.state.Settings.common.windowDefaultHeight}/>
                                </div>
                                <div className="common-section-content-ui-account-item-unit">像素</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterface) => ({
    state: {
        Settings: state.Settings,
    }
});

export default connect(mapStateToProps)(Common);
