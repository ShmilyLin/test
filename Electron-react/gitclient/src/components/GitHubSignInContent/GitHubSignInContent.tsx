import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { Subscription } from 'rxjs';
import Listener, { ListenerKeys } from '../../utils/Listener';

// Store
import CommonActions from '../../store/Common/actions';

// CSS
import './GitHubSignInContent.scss';

interface GitHubSignInContentProps {
    onTokenInputChange: (value: string) => void;
    onTokenSignInButtonClick: () => void;
    onOAuthButtonClick: () => void;
    dispatch: (action: AnyAction) => void;
}

interface GitHubSignInContentState {
    tokenInputShowHelpView: boolean;
    tokenInputOnFocus: boolean;
    tokenInputValue: string;
}

class GitHubSignInContent extends React.Component<GitHubSignInContentProps, GitHubSignInContentState> {
    public documentClickListener: Subscription|null = null;

    constructor(props: GitHubSignInContentProps) {
        super(props);
        console.log('GitHubSignInContent', props);
        
        this.state = {
            tokenInputShowHelpView: false,
            tokenInputOnFocus: false,
            tokenInputValue: '',
        };

        this.documentClickEvent = this.documentClickEvent.bind(this);
        this.tokenInputViewHelpButtonClick = this.tokenInputViewHelpButtonClick.bind(this);
        this.tokenInputViewFocusEvent = this.tokenInputViewFocusEvent.bind(this);
        this.tokenInputViewBlurEvent = this.tokenInputViewBlurEvent.bind(this);
        this.tokenInputViewOnChangeEvent = this.tokenInputViewOnChangeEvent.bind(this);
        this.signInButtonClick = this.signInButtonClick.bind(this);
    }

    public componentDidMount() {
        this.documentClickListener = Listener.on(ListenerKeys.DocumentClick, this.documentClickEvent);
    }

    public componentWillUnmount() {
        if (this.documentClickListener) {
            this.documentClickListener.unsubscribe();
        }
    }

    public documentClickEvent() {
        if (this.state.tokenInputShowHelpView) {
            this.setState({
                tokenInputShowHelpView: false,
            })
        }
    }

    // 点击Token的帮助按钮
    public tokenInputViewHelpButtonClick(event: any) {
        let tempShow = !this.state.tokenInputShowHelpView;
        this.setState({
            tokenInputShowHelpView: tempShow,
        });

        event.stopPropagation();
    }

    // Token输入框聚焦
    public tokenInputViewFocusEvent() {
        this.setState({
            tokenInputOnFocus: true,
        });
    }
    
    // Token输入框失焦
    public tokenInputViewBlurEvent() {
        this.setState({
            tokenInputOnFocus: false,
        });
    }
    
    // 输入框输入文字
    public tokenInputViewOnChangeEvent(event: any) {
        this.setState({
            tokenInputValue: event.target.value
        });
    }

    // 点击登录
    public signInButtonClick() {
        if (this.state.tokenInputValue.length > 0) {

        }else {
            this.props.dispatch(CommonActions.ShowModal({
                title: 'Token不可以为空',
                content: 'Token请在GitHub > User > Settings > Developer settings > Personal access tokens中设置。'
            }));
        }
    }

    public render() {
        return (
            <div className="ghsic">
                <div className="ghsic-item">
                    <div className="ghsic-item-title">
                        <div className="ghsic-item-title-text">Token</div>
                        <div className="ghsic-item-title-help" onClick={(e) => this.tokenInputViewHelpButtonClick(e)}></div>
                        {this.state.tokenInputShowHelpView &&
                            <div className="ghsic-item-title-tips">
                                <div className="ghsic-item-title-tips-triangle"></div>
                                <div className="ghsic-item-title-tips-text">
                                    <p>· 建议使用Token认证方式登录。</p>
                                    <p>· Token仅用于GitHub API校验，不会被上传服务器。</p>
                                    <p>· Token请在GitHub > User > Settings > Developer settings > Personal access tokens中设置。</p>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={"ghsic-item-input" + (this.state.tokenInputOnFocus ? ' ghsic-item-input-focus' : '')}>
                        <input type="text" 
                            placeholder="请输入Token" 
                            value={this.state.tokenInputValue} 
                            onFocus={this.tokenInputViewFocusEvent} 
                            onBlur={this.tokenInputViewBlurEvent} 
                            onChange={this.tokenInputViewOnChangeEvent}/>
                    </div>
                </div>
                <div className="ghsic-button" onClick={this.signInButtonClick}>登录</div>
                <div className="ghsic-or">
                    <div className="ghsic-or-line"></div>
                    <div className="ghsic-or-text">或者</div>
                    <div className="ghsic-or-line"></div>
                </div>
                <div className="ghsic-button">OAuth 登录</div>
            </div>
        );
    }
}


export default connect()(GitHubSignInContent);
