import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import axios from 'axios';

// Models
import GitHubTimelineItem from '../../../models/GitHubTimelineItem';
import GitHubStarsItem from '../../../models/GitHubStarsItem';

// CSS
import './GitHubSignIn.scss';

interface GitHubSignInProps {
    dispatch: (action: AnyAction) => void;
}

interface GitHubSignInState {
    isLoading: boolean;

    showTabIndex: number;

    timeline: {
        isLoading: boolean;
        page: number;
        list: GitHubTimelineItem[]
    };

    stars: {
        isLoading: boolean;
        page: number;
        list: GitHubStarsItem[]
    }
}

class GitHubSignIn extends React.Component<GitHubSignInProps, GitHubSignInState> {
    constructor(props: GitHubSignInProps) {
        super(props);
        console.log('GitHubSignIn', props);
        
        this.state = {
            isLoading: false,
            showTabIndex: 0,
            timeline: {
                isLoading: false,
                page: 0,
                list: [],
            },
            stars: {
                isLoading: false,
                page: 0,
                list: [],
            }
        };

        this.timelineButtonClick = this.timelineButtonClick.bind(this);
        this.startsButtonClick = this.startsButtonClick.bind(this);
        this.topicsButtonClick = this.topicsButtonClick.bind(this);
        this.timelineMouseWheelEvent = this.timelineMouseWheelEvent.bind(this);
    }

    public componentDidMount() {
        this.loadTimelineData();
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

    }

    public loadTimelineData(page: number = 1) {
        if (!this.state.timeline.isLoading) {
            let tempTimeLine = this.state.timeline;
            this.setState({
                timeline: {
                    ...tempTimeLine,
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
                            }
                        })
                    } else {
                        this.setState({
                            timeline: {
                                ...tempTimeLine,
                                list: tempTimeLine.list.concat(tempList),
                                isLoading: false,
                                page,
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
                    }
                });
            })
        }
    }

    public loadStarsData(page: number = 1) {
        if (!this.state.stars.isLoading) {
            let tempStars = this.state.stars;
            this.setState({
                stars: {
                    ...tempStars,
                    isLoading: true,
                }
            });

            axios.get('https://api.github.com/search/repositories?q=is:public&sort=stars').then((res) => {
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
                            }
                        })
                    } else {
                        this.setState({
                            stars: {
                                ...tempStars,
                                list: tempStars.list.concat(tempList),
                                isLoading: false,
                                page,
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
                    }
                });
            })
        }
    }

    public timelineMouseWheelEvent(event: any) {
        if (event.nativeEvent.wheelDelta < 0) { // 向上
            let timelineListDom = (this.refs['ghsi-content-timeline'] as any);
            let currentTop = timelineListDom.scrollTop;
            timelineListDom.scrollTo(0, currentTop + 30);
            if (currentTop + 400 >= timelineListDom.scrollHeight - 100) {
                this.loadTimelineData(this.state.timeline.page + 1);
            }
          } else if (event.nativeEvent.wheelDelta > 0) { // 向下
            let currentTop = (this.refs['ghsi-content-timeline'] as any).scrollTop;
            if (currentTop > 0 ) {
              (this.refs['ghsi-content-timeline'] as any).scrollTo(0, currentTop - 30);
            }
          }
    }

    public render() {
        let isShowLeftLoading = false;
        let LeftContent;
        switch (this.state.showTabIndex) {
            case 0:
                if (this.state.timeline.page < 1 && this.state.timeline.isLoading) {
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
                if (this.state.stars.page < 1 && this.state.stars.isLoading) {
                    isShowLeftLoading = true;
                }

                if (!isShowLeftLoading) {
                    LeftContent = (
                        <div className="ghsi-content-stars">
                            <div className=""></div>
                        </div>
                    );
                }
                break;
            case 2:
                if (!isShowLeftLoading) {
                    LeftContent = (
                        <div className="ghsi-content-topics">
                            <div className=""></div>
                        </div>
                    );
                }
                break;
        }

        return (
            <div className="ghsi">
                <div className="ghsi-content">
                    <div className="ghsi-content-header">
                        <div className="ghsi-content-header-list">
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 0 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.timelineButtonClick}>时间线</div>
                            <div className="ghsi-content-header-list-line"></div>
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 1 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.startsButtonClick}>Star排行</div>
                            <div className="ghsi-content-header-list-line"></div>
                            <div className={'ghsi-content-header-list-item' + (this.state.showTabIndex === 1 ? ' ghsi-content-header-list-item-selected' : '')} 
                                onClick={this.topicsButtonClick}>流行话题</div>
                        </div>
                        <div className="ghsi-content-header-refresh" style={{
                            display: isShowLeftLoading ? 'none' : 'block'
                        }} title="刷新"></div>
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
                        <div className="ghsi-signin-item-title">用户名</div>
                        <div className="ghsi-signin-item-input">
                            <input type="text" placeholder="请输入用户名"/>
                        </div>
                    </div>
                    <div className="ghsi-signin-item">
                        <div className="ghsi-signin-item-title">密码</div>
                        <div className="ghsi-signin-item-input">
                            <input type="password" placeholder="请输入密码"/>
                        </div>
                    </div>
                    <div className="ghsi-signin-button">登录</div>
                </div>
            </div>
        );
    }
}


export default connect()(GitHubSignIn);
