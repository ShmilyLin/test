import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// Store
import { GlobalInterface } from '../../store/state';
import { UserInterface } from '../../../../store/User/state';
import { SettingsInterface } from '../../../../store/Settings/state';
import SettingsActions from '../../../../store/Settings/actions';

// Components
import GitHubSignInContent from '../../../../components/GitHubSignInContent/GitHubSignInContent';
import SectionCheckBoxItem from '../SectionCheckBoxItem/SectionCheckBoxItem';

// CSS
import './GitHub.scss';
import CommonActions from '../../../../store/Common/actions';

interface GitHubProps {
    show: boolean;
    state: {
        Settings: SettingsInterface;
        User: UserInterface;
    }
    dispatch: (action: AnyAction) => void;
}

interface GitHubState {
    browser: {
        showStatus: number;
        show: boolean;
        history: boolean;
    };
    account: {
        showStatus: number;
        show: boolean;
    }
}

class GitHub extends React.Component<GitHubProps, GitHubState> {
    constructor(props: GitHubProps) {
        super(props);
        console.log('GitHub', props);
        
        this.state = {
            browser: {
                showStatus: 0,
                show: true,
                history: false,
            },
            account: {
                showStatus: 0,  
                show: true,
            }
        };

        this.sectionItemHeaderClick = this.sectionItemHeaderClick.bind(this);
        this.browserHistoryCheckChangeEvent = this.browserHistoryCheckChangeEvent.bind(this);
        this.gitHubSignInTokenInputChangeEvent = this.gitHubSignInTokenInputChangeEvent.bind(this);
        this.gitHubSignInTokenSignInButtonClick = this.gitHubSignInTokenSignInButtonClick.bind(this);
        this.gitHubSignInOAuthButtonClick = this.gitHubSignInOAuthButtonClick.bind(this);
    }

    public sectionItemHeaderClick(name: string) {
        switch (name) {
            case 'browser':
                let tempBrowser = this.state.browser;
                if (tempBrowser.show) {
                    this.setState({
                        browser: {
                            ...tempBrowser,
                            show: false,
                        }
                    });
                } else {
                    this.setState({
                        browser: {
                            ...tempBrowser,
                            show: true,
                        }
                    });
                }
                break;
            case 'account':
                let tempAccount = this.state.account;
                if (tempAccount.show) {
                    this.setState({
                        account: {
                            ...tempAccount,
                            show: false,
                        }
                    });
                } else {
                    this.setState({
                        account: {
                            ...tempAccount,
                            show: true,
                        }
                    });
                }
                break;
        }
    }

    public browserHistoryCheckChangeEvent(checked: boolean) {
        this.props.dispatch(CommonActions.ShowModal({
            title: '注意',
            content: '修改“记录浏览历史”会重置所有打开的GitHub标签页。',
            showCancel: true,
            confirmText: '确认修改',
            success: (res) => {
                if (res.confirm) {
                    // let tempBrowser = this.state.browser;
                    // this.setState({
                    //     browser: {
                    //         ...tempBrowser,
                    //         history: checked,
                    //     }
                    // });
                    this.props.dispatch(SettingsActions.HistoryModeChange(checked));
                }
            }
        }));
    }

    public gitHubSignInTokenInputChangeEvent(value: string) {

    }

    public gitHubSignInTokenSignInButtonClick() {

    }

    public gitHubSignInOAuthButtonClick() {

    }

    public render() {
        return (
            <div className="github" style={{
                display: this.props.show ? '' : 'none',
            }}>
                {/* 浏览 */}
                <div className="github-section">
                    <div className={"github-section-header" + (this.state.browser.show ? '' : ' github-section-header-hide')} 
                        onClick={() => this.sectionItemHeaderClick('browser')}>
                        <div className="github-section-header-icon"></div>
                        <div className="github-section-header-title">浏览</div>
                    </div>
                    <div className="github-section-content" style={{
                        height: this.state.browser.show ? '93px' : '0px',
                        opacity: this.state.browser.show ? 1 : 0,
                    }}>
                        <SectionCheckBoxItem 
                            checked={this.props.state.Settings.github.history} 
                            title='记录浏览历史（支持回退）' 
                            desc={"记录浏览历史会占用内存和计算资源，当一个标签页下浏览历史过多时可能会导致卡顿和加载缓慢，严重时可能会导致闪退和卡死。\n*注意：设置时会重置所有打开的GitHub页面"} 
                            onCheckChange={this.browserHistoryCheckChangeEvent} />
                    </div>
                </div>
                {/* 账号 */}
                <div className="github-section">
                    <div className={"github-section-header" + (this.state.account.show ? '' : ' github-section-header-hide')} 
                        onClick={() => this.sectionItemHeaderClick('account')}>
                        <div className="github-section-header-icon"></div>
                        <div className="github-section-header-title">账号</div>
                    </div>
                    <div className="github-section-content" style={{
                        height: this.state.account.show ? '270px' : '0px',
                        opacity: this.state.account.show ? 1 : 0,
                    }}>
                        {this.props.state.User.github.loggedin ? 
                            <div className="github-section-content-account-loggedin">
                                
                            </div>
                            : <div className="github-section-content-account-notlogin">
                                <div className="github-section-content-account-notlogin-text">您还没有登录GitHub账号，可以使用以下方式登录：</div>
                                <div className="github-section-content-account-notlogin-content">
                                    <GitHubSignInContent 
                                        onTokenInputChange={this.gitHubSignInTokenInputChangeEvent} 
                                        onTokenSignInButtonClick={this.gitHubSignInTokenSignInButtonClick} 
                                        onOAuthButtonClick={this.gitHubSignInOAuthButtonClick}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalInterface) => ({
    state: {
        Settings: state.Settings,
        User: state.User
    }
});

export default connect(mapStateToProps)(GitHub);
