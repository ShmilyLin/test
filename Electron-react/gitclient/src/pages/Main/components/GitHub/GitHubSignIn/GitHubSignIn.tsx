import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import axios from 'axios';
import { Subscription } from 'rxjs';
import Listener, { ListenerKeys } from '../../../utils/Listener';

// Models
import GitHubTimelineItem from '../../../models/GitHubTimelineItem';
import GitHubStarsItem from '../../../models/GitHubStarsItem';
import GitHubTopicsItem from '../../../models/GitHubTopicsItem';

// CSS
import './GitHubSignIn.scss';
import CommonActions from '../../../store/Common/actions';
import GitHubRouteItem from '../../../models/GitHubRouteItem';



interface GitHubSignInProps {
    $route: GitHubRouteItem;
    isLast: boolean;
    dispatch: (action: AnyAction) => void;
}

interface GitHubSignInState {
    isLoading: boolean;

    showTabIndex: number;

    isShowScrollToTop: boolean;

    timeline: {
        isLoading: boolean;
        page: number;
        loadingPage: number;
        list: GitHubTimelineItem[]
    };

    stars: {
        isLoading: boolean;
        page: number;
        maxPage: number;
        loadingPage: number;
        list: GitHubStarsItem[]
    };

    topics: {
        isLoading: boolean;
        list: GitHubTopicsItem[];
    };

    tokenInputValue: string;
    tokenInputOnFocus: boolean;
    tokenInputShowHelpView: boolean;
}

class GitHubSignIn extends React.Component<GitHubSignInProps, GitHubSignInState> {
    public timelineScrollTop: number = 0;
    public starsScrollTop: number = 0;
    public topicsScrollTop: number = 0;

    public documentClickListener: Subscription|null = null;

    constructor(props: GitHubSignInProps) {
        super(props);
        console.log('GitHubSignIn', props);
        
        this.state = {
            isLoading: false,
            showTabIndex: 0,
            isShowScrollToTop: false,
            timeline: {
                isLoading: false,
                page: 0,
                loadingPage: 0,
                list: [],
            },
            stars: {
                isLoading: false,
                page: 0,
                loadingPage: 0,
                maxPage: 33,
                list: [],
            },
            topics: {
                isLoading: false,
                list: [],
            },

            tokenInputValue: '',
            tokenInputOnFocus: false,
            tokenInputShowHelpView: false,
        };

        this.documentClickEvent = this.documentClickEvent.bind(this);
        this.timelineButtonClick = this.timelineButtonClick.bind(this);
        this.startsButtonClick = this.startsButtonClick.bind(this);
        this.topicsButtonClick = this.topicsButtonClick.bind(this);
        this.timelineMouseWheelEvent = this.timelineMouseWheelEvent.bind(this);
        this.starsMouseWheelEvent = this.starsMouseWheelEvent.bind(this);
        this.topicsMouseWheelEvent = this.topicsMouseWheelEvent.bind(this);
        this.scrollToTopButtonClick = this.scrollToTopButtonClick.bind(this);
        this.refreshButtonClick = this.refreshButtonClick.bind(this);
        this.tokenInputViewHelpButtonClick = this.tokenInputViewHelpButtonClick.bind(this);
        this.tokenInputViewFocusEvent = this.tokenInputViewFocusEvent.bind(this);
        this.tokenInputViewBlurEvent = this.tokenInputViewBlurEvent.bind(this);
        this.tokenInputViewOnChangeEvent = this.tokenInputViewOnChangeEvent.bind(this);
        this.signInButtonClick = this.signInButtonClick.bind(this);
    }

    public componentDidMount() {
        this.loadTimelineData();
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

    public timelineButtonClick() {
        if (this.state.showTabIndex !== 0) {
            this.setState({
                showTabIndex: 0,
            });

            if (this.state.timeline.list.length <= 0) {
                this.loadTimelineData();
            }
        }
    }
    
    public startsButtonClick() {
        if (this.state.showTabIndex !== 1) {
            this.setState({
                showTabIndex: 1,
            });

            if (this.state.stars.list.length <= 0) {
                this.loadStarsData();
            }
        }
    }
    
    public topicsButtonClick() {
        if (this.state.showTabIndex !== 2) {
            this.setState({
                showTabIndex: 2,
            });

            if (this.state.topics.list.length <= 0) {
                this.loadTopicsData();
            }
        }
    }

    public loadTimelineData(page: number = 1) {
        if (!this.state.timeline.isLoading) {
            let tempTimeLine = this.state.timeline;
            this.setState({
                timeline: {
                    ...tempTimeLine,
                    loadingPage: page,
                    isLoading: true,
                }
            });

            axios.get('https://github.com/timeline?page=' + page).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    let parser = new DOMParser();
                    let xmlObject = parser.parseFromString(res.data, "text/xml");
                    let tempFirstChild = xmlObject.firstChild as ChildNode
                    let tempList: GitHubTimelineItem[] = [];
                    for (let i = 0; i < tempFirstChild.childNodes.length; i++) {
                        let tempXmlItem = tempFirstChild.childNodes[i];
                        if (tempXmlItem.nodeName === 'entry') {
                            tempList.push(new GitHubTimelineItem(tempXmlItem));
                        }
                    }

                    console.log(tempList);

                    let tempTimeLine = this.state.timeline;
                    if (page === 1) {
                        this.setState({
                            timeline: {
                                ...tempTimeLine,
                                list: tempList,
                                isLoading: false,
                                page,
                                loadingPage: 0,
                            }
                        })
                    } else {
                        this.setState({
                            timeline: {
                                ...tempTimeLine,
                                list: tempTimeLine.list.concat(tempList),
                                isLoading: false,
                                page,
                                loadingPage: 0,
                            }
                        })
                    }
                } else {
                    console.log('failed');
                    let tempTimeLine = this.state.timeline;
                    this.setState({
                        timeline: {
                            ...tempTimeLine,
                            isLoading: false,
                            loadingPage: 0,
                        }
                    });
                }
            }).catch((error) => {
                console.log(error);
                let tempTimeLine = this.state.timeline;
                this.setState({
                    timeline: {
                        ...tempTimeLine,
                        isLoading: false,
                        loadingPage: 0,
                    }
                });
            })
        }
    }

    public loadStarsData(page: number = 1) {
        if (!this.state.stars.isLoading && this.state.stars.maxPage >= page) {
            let tempStars = this.state.stars;
            this.setState({
                stars: {
                    ...tempStars,
                    isLoading: true,
                    loadingPage: page,
                }
            });

            axios.get('https://api.github.com/search/repositories?q=is:public stars:>=10000&sort=stars').then((res) => {
                console.log(res);
                if (res.status === 200) {
                    let tempList: GitHubStarsItem[] = [];
                    for (const resItem of res.data.items) {
                        tempList.push(new GitHubStarsItem(resItem));
                    }

                    console.log(tempList);

                    let tempStars = this.state.stars;
                    if (page === 1) {
                        this.setState({
                            stars: {
                                ...tempStars,
                                list: tempList,
                                isLoading: false,
                                page,
                                loadingPage: 0,
                            }
                        })
                    } else {
                        this.setState({
                            stars: {
                                ...tempStars,
                                list: tempStars.list.concat(tempList),
                                isLoading: false,
                                page,
                                loadingPage: 0,
                            }
                        })
                    }
                } else {
                    console.log('failed');
                    let tempStars = this.state.stars;
                    this.setState({
                        stars: {
                            ...tempStars,
                            isLoading: false,
                            loadingPage: 0,
                        }
                    });
                }
            }).catch((error) => {
                console.log(error);
                let tempStars = this.state.stars;
                this.setState({
                    stars: {
                        ...tempStars,
                        isLoading: false,
                        loadingPage: 0,
                    }
                });
            })
        }
    }

    public loadTopicsData() {
        if (!this.state.topics.isLoading) {
            let tempTopics = this.state.topics;
            this.setState({
                topics: {
                    ...tempTopics,
                    isLoading: true,
                }
            });

            axios.get('https://api.github.com/search/topics?q=is:featured', {
                headers: {
                    Accept: 'application/vnd.github.mercy-preview+json',
                }
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    let tempList: GitHubTopicsItem[] = [];
                    for (const resItem of res.data.items) {
                        tempList.push(new GitHubTopicsItem(resItem));
                    }

                    console.log(tempList);

                    let tempTopics = this.state.topics;
                    this.setState({
                        topics: {
                            ...tempTopics,
                            list: tempList,
                            isLoading: false,
                        }
                    })
                } else {
                    console.log('failed');
                    let tempTopics = this.state.topics;
                    this.setState({
                        topics: {
                            ...tempTopics,
                            isLoading: false,
                        }
                    });
                }
            }).catch((error) => {
                console.log(error);
                let tempTopics = this.state.topics;
                this.setState({
                    topics: {
                        ...tempTopics,
                        isLoading: false,
                    }
                });
            })
        }
    }

    public timelineMouseWheelEvent(event: any) {
        if (event.nativeEvent.wheelDelta < 0) { // 向上
            let timelineListDom = (this.refs['ghsi-content-timeline'] as any);
            let currentTop = timelineListDom.scrollTop;
            this.timelineScrollTop = currentTop + 30;
            timelineListDom.scrollTo(0, currentTop + 30);
            if (currentTop + 400 >= timelineListDom.scrollHeight - 100) {
                this.loadTimelineData(this.state.timeline.page + 1);
            }

            if (!this.state.isShowScrollToTop && currentTop > 0) {
                this.setState({
                    isShowScrollToTop: true,
                })
            }
        } else if (event.nativeEvent.wheelDelta > 0) { // 向下
            let currentTop = (this.refs['ghsi-content-timeline'] as any).scrollTop;
            if (currentTop > 0 ) {
                this.timelineScrollTop = currentTop - 30;
                (this.refs['ghsi-content-timeline'] as any).scrollTo(0, currentTop - 30);
            } else {
                if (this.state.isShowScrollToTop) {
                    this.setState({
                        isShowScrollToTop: false,
                    })
                }
            }
        }
    }

    public starsMouseWheelEvent(event: any) {
        if (event.nativeEvent.wheelDelta < 0) { // 向上
            let starsListDom = (this.refs['ghsi-content-stars'] as any);
            let currentTop = starsListDom.scrollTop;
            this.starsScrollTop = currentTop + 30;
            starsListDom.scrollTo(0, currentTop + 30);
            if (currentTop + 400 >= starsListDom.scrollHeight - 100) {
                this.loadStarsData(this.state.stars.page + 1);
            }

            if (!this.state.isShowScrollToTop && currentTop > 0) {
                this.setState({
                    isShowScrollToTop: true,
                })
            }
        } else if (event.nativeEvent.wheelDelta > 0) { // 向下
            let currentTop = (this.refs['ghsi-content-stars'] as any).scrollTop;
            if (currentTop > 0 ) {
                this.starsScrollTop = currentTop - 30;
                (this.refs['ghsi-content-stars'] as any).scrollTo(0, currentTop - 30);
            } else {
                if (this.state.isShowScrollToTop) {
                    this.setState({
                        isShowScrollToTop: false,
                    })
                }
            }
        }
    }

    public topicsMouseWheelEvent(event: any) {
        if (event.nativeEvent.wheelDelta < 0) { // 向上
            let topicsListDom = (this.refs['ghsi-content-topics'] as any);
            let currentTop = topicsListDom.scrollTop;
            this.topicsScrollTop = currentTop + 30;
            topicsListDom.scrollTo(0, currentTop + 30);
            if (!this.state.isShowScrollToTop && currentTop > 0) {
                this.setState({
                    isShowScrollToTop: true,
                })
            }
        } else if (event.nativeEvent.wheelDelta > 0) { // 向下
            let currentTop = (this.refs['ghsi-content-topics'] as any).scrollTop;
            if (currentTop > 0 ) {
                this.topicsScrollTop = currentTop - 30;
                (this.refs['ghsi-content-topics'] as any).scrollTo(0, currentTop - 30);
            } else {
                if (this.state.isShowScrollToTop) {
                    this.setState({
                        isShowScrollToTop: false,
                    })
                }
            }
        }
    }

    public scrollToTopButtonClick() {
        switch (this.state.showTabIndex) {
            case 0:
                this.timelineScrollTop = 0;
                (this.refs['ghsi-content-timeline'] as any).scrollTo(0, 0);
                break;
            case 1:
                this.starsScrollTop = 0;
                (this.refs['ghsi-content-stars'] as any).scrollTo(0, 0);
                break;
            case 2:
                this.topicsScrollTop = 0;
                (this.refs['ghsi-content-topics'] as any).scrollTo(0, 0);
                break;
        }
    }
    
    public refreshButtonClick() {
        switch (this.state.showTabIndex) {
            case 0:
                this.loadTimelineData();
                break;
            case 1:
                this.loadStarsData();
                break;
            case 2:
                this.loadTopicsData();
                break;
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
        let isShowLeftLoading = false;
        let isShowRefresh = false;
        let LeftContent;
        switch (this.state.showTabIndex) {
            case 0:
                isShowRefresh = !this.state.timeline.isLoading;

                if (this.state.timeline.loadingPage === 1 && this.state.timeline.isLoading) {
                    isShowLeftLoading = true;
                }

                if (!isShowLeftLoading) {
                    LeftContent = (
                        <div className="ghsi-content-timeline" ref="ghsi-content-timeline" onWheel={(e) => this.timelineMouseWheelEvent(e)}>
                            {this.state.timeline.list.map((timelineItem, timelineIndex) => 
                                <div className="ghsi-content-timeline-item" key={timelineItem.id}>
                                    <div className="ghsi-content-timeline-item-view">
                                        <div className="ghsi-content-timeline-item-view-avatar" style={{
                                            backgroundImage: 'url(' + timelineItem.avatar + ')',
                                        }}></div>
                                        <div className="ghsi-content-timeline-item-view-content">
                                            <div className="ghsi-content-timeline-item-view-content-name">{timelineItem.author.name}</div>
                                            <div className="ghsi-content-timeline-item-view-content-title">{timelineItem.title}</div>
                                            <div className="ghsi-content-timeline-item-view-content-time">{timelineItem.showTime}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.state.timeline.isLoading &&
                                <div className="ghsi-content-timeline-loading"></div>
                            }
                        </div>
                    );
                }
                break;
            case 1:
                isShowRefresh = !this.state.stars.isLoading;
                
                if (this.state.stars.loadingPage === 1 && this.state.stars.isLoading) {
                    isShowLeftLoading = true;
                }

                if (!isShowLeftLoading) {
                    LeftContent = (
                        <div className="ghsi-content-stars" ref="ghsi-content-stars" onWheel={(e) => this.starsMouseWheelEvent(e)}>
                            {this.state.stars.list.map((starsItem, starsIndex) => 
                                <div className="ghsi-content-stars-item" key={starsItem.id}>
                                    <div className="ghsi-content-stars-item-index">{starsIndex + 1}</div>
                                    <div className="ghsi-content-stars-item-view">
                                        <div className="ghsi-content-stars-item-view-name">{starsItem.full_name}</div>
                                        <div className="ghsi-content-stars-item-view-desc">{starsItem.description}</div>
                                        <div className="ghsi-content-stars-item-view-language">
                                            <div className="ghsi-content-stars-item-view-language-icon"></div>
                                            <div className="ghsi-content-stars-item-view-language-text">{starsItem.language}</div>
                                        </div>
                                        <div className="ghsi-content-stars-item-view-info">
                                            <div className="ghsi-content-stars-item-view-info-item">
                                                <div className="ghsi-content-stars-item-view-info-item-icon ghsi-content-stars-item-view-info-item-icon-watchers"></div>
                                                <div className="ghsi-content-stars-item-view-info-item-count">{starsItem.watchers_count}</div>
                                            </div>
                                            <div className="ghsi-content-stars-item-view-info-item">
                                                <div className="ghsi-content-stars-item-view-info-item-icon ghsi-content-stars-item-view-info-item-icon-stars"></div>
                                                <div className="ghsi-content-stars-item-view-info-item-count">{starsItem.stargazers_count}</div>
                                            </div>
                                            <div className="ghsi-content-stars-item-view-info-item">
                                                <div className="ghsi-content-stars-item-view-info-item-icon ghsi-content-stars-item-view-info-item-icon-forks"></div>
                                                <div className="ghsi-content-stars-item-view-info-item-count">{starsItem.forks_count}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.state.stars.isLoading &&
                                <div className="ghsi-content-stars-loading"></div>
                            }
                        </div>
                    );
                }
                break;
            case 2:
                isShowRefresh = !this.state.topics.isLoading;
            
                if (this.state.topics.isLoading) {
                    isShowLeftLoading = true;
                }

                if (!isShowLeftLoading) {
                    LeftContent = (
                        <div className="ghsi-content-topics" ref="ghsi-content-topics" onWheel={(e) => this.topicsMouseWheelEvent(e)}>
                            {this.state.topics.list.map((topicsItem) => 
                                <div className="ghsi-content-topics-item">
                                    <div className="ghsi-content-topics-item-name">
                                        <div className="ghsi-content-topics-item-name-front">#</div>
                                        <div className="ghsi-content-topics-item-name-text">{topicsItem.display_name}</div>
                                    </div>
                                    <div className="ghsi-content-topics-item-desc">{topicsItem.short_description}</div>
                                </div>
                            )}
                        </div>
                    );
                }
                break;
        }

        return (
            <div className="ghsi" style={{
                display: this.props.isLast ? '' : 'none',
            }}>
                <div className="ghsi-content">
                    <div className="ghsi-content-header">
                        <div className="ghsi-content-header-list">
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 0 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.timelineButtonClick}>时间线</div>
                            <div className="ghsi-content-header-list-line"></div>
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 1 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.startsButtonClick}>Star排行</div>
                            <div className="ghsi-content-header-list-line"></div>
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 2 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.topicsButtonClick}>流行话题</div>
                        </div>
                        <div className="ghsi-content-header-actions">
                            {this.state.isShowScrollToTop &&
                                <div className="ghsi-content-header-actions-scrolltop" title="滚到顶部" onClick={this.scrollToTopButtonClick}></div>
                            }
                            {isShowRefresh &&
                                <div className="ghsi-content-header-actions-refresh" title="刷新" onClick={this.refreshButtonClick}></div>
                            }
                        </div>
                    </div>
                    {isShowLeftLoading ? 
                        <div className="ghsi-content-loading">
                            加载中
                        </div> : 
                        LeftContent
                    }
                </div>
                <div className="ghsi-line"></div>
                <div className="ghsi-signin">
                    <div className="ghsi-signin-header">登录GitHub</div>
                    <div className="ghsi-signin-item">
                        <div className="ghsi-signin-item-title">
                            <div className="ghsi-signin-item-title-text">Token</div>
                            <div className="ghsi-signin-item-title-help" onClick={(e) => this.tokenInputViewHelpButtonClick(e)}></div>
                            {this.state.tokenInputShowHelpView &&
                                <div className="ghsi-signin-item-title-tips">
                                    <div className="ghsi-signin-item-title-tips-triangle"></div>
                                    <div className="ghsi-signin-item-title-tips-text">
                                        <p>· 建议使用Token认证方式登录。</p>
                                        <p>· Token仅用于GitHub API校验，不会被上传服务器。</p>
                                        <p>· Token请在GitHub > User > Settings > Developer settings > Personal access tokens中设置。</p>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={"ghsi-signin-item-input" + (this.state.tokenInputOnFocus ? ' ghsi-signin-item-input-focus' : '')}>
                            <input type="text" 
                                placeholder="请输入Token" 
                                value={this.state.tokenInputValue} 
                                onFocus={this.tokenInputViewFocusEvent} 
                                onBlur={this.tokenInputViewBlurEvent} 
                                onChange={this.tokenInputViewOnChangeEvent}/>
                        </div>
                    </div>
                    <div className="ghsi-signin-button" onClick={this.signInButtonClick}>登录</div>
                    <div className="ghsi-signin-or">
                        <div className="ghsi-signin-or-line"></div>
                        <div className="ghsi-signin-or-text">或者</div>
                        <div className="ghsi-signin-or-line"></div>
                    </div>
                    <div className="ghsi-signin-button">OAuth 登录</div>
                </div>
            </div>
        );
    }
}


export default connect()(GitHubSignIn);
