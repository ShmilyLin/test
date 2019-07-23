import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// Components
import SectionCheckBoxItem from '../SectionCheckBoxItem/SectionCheckBoxItem';

// Store
import { GlobalInterface } from '../../store/state';
import { SettingsInterface } from '../../../../store/Settings/state';

// CSS
import './Git.scss';

interface GitProps {
    show: boolean,
    state: {
        Settings: SettingsInterface;
    };
    dispatch: (action: AnyAction) => void;
}

interface GitState {
    general : {
        show: boolean;
    };
}

class Git extends React.Component<GitProps, GitState> {
    constructor(props: GitProps) {
        super(props);
        console.log('Git', props);
        
        this.state = {
            general: {
                show: true,
            }
        };

        this.sectionItemHeaderClick = this.sectionItemHeaderClick.bind(this);
        this.useGlobalAccountCheckChangeEvent = this.useGlobalAccountCheckChangeEvent.bind(this);
    }

    public sectionItemHeaderClick(name: string) {
        switch (name) {
            case 'general':
                let tempGeneral = this.state.general;
                if (tempGeneral.show) {
                    this.setState({
                        general: {
                            ...tempGeneral,
                            show: false,
                        }
                    });
                } else {
                    this.setState({
                        general: {
                            ...tempGeneral,
                            show: true,
                        }
                    });
                }
                break;
        }
    }

    public useGlobalAccountCheckChangeEvent(checked: boolean) {

    }

    public render() {
        return (
            <div className="git" style={{
                display: this.props.show ? '' : 'none',
            }}>
                <div className="git-section">
                    <div className={"git-section-header" + (this.state.general.show ? '' : ' git-section-header-hide')} 
                        onClick={() => this.sectionItemHeaderClick('general')}>
                        <div className="git-section-header-icon"></div>
                        <div className="git-section-header-title">通用</div>
                    </div>
                    <div className="git-section-content" style={{
                        height: this.state.general.show ? '300px' : '0px',
                        opacity: this.state.general.show ? 1 : 0,
                    }}>
                        <SectionCheckBoxItem 
                            checked={this.props.state.Settings.git.useGlobalAccount} 
                            title='是否使用全局用户信息' 
                            onCheckChange={this.useGlobalAccountCheckChangeEvent} />
                        <div className={'git-section-content-ui-account' + (this.props.state.Settings.git.useGlobalAccount ? '' : ' git-section-content-ui-account-disable')}>
                            <div className="git-section-content-ui-account-desc">全局默认用户信息</div>
                            <div className="git-section-content-ui-account-item">
                                <div className="git-section-content-ui-account-item-title">名称</div>
                                <div className="git-section-content-ui-account-item-input">
                                    <input type="text" placeholder="请输入一个英文名称"/>
                                </div>
                            </div>
                            <div className="git-section-content-ui-account-item">
                                <div className="git-section-content-ui-account-item-title">邮箱地址</div>
                                <div className="git-section-content-ui-account-item-input">
                                    <input type="text" placeholder="请输入一个邮箱地址"/>
                                </div>
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

export default connect(mapStateToProps)(Git);
