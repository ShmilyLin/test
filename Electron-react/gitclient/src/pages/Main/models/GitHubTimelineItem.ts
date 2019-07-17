class GitHubTimelineItem {
    public id: string = '';
    public published: string = '';
    public publishedTimestamp: number = 0;
    public updated: string = '';
    public updatedTimestamp: number = 0;
    public updatedTimeString: string = '';
    public link: string = '';
    public title: string = '';
    public avatar: string = '';
    public author: {
        name: string;
        uri: string;
    } = {
        name: '',
        uri: '',
    }

    get showTime() {
        let nowTimeStamp = (new Date()).getTime();
        let tempTimeInterval = nowTimeStamp - this.updatedTimestamp;
        if (tempTimeInterval < 4 * 60 * 1000) {
            if (tempTimeInterval < 60 * 1000) {
                if (tempTimeInterval < 10 * 1000) {
                    if (tempTimeInterval < 5 * 1000) {
                        return this.updatedTimeString + '(刚刚)';
                    }

                    return this.updatedTimeString + '(5分钟之前)';
                }

                return this.updatedTimeString + '(' + Math.floor(tempTimeInterval/(1000)) + '分钟之前)';
            }

            return this.updatedTimeString + '(' + Math.floor(tempTimeInterval/(1000*60)) + '小时之前)';
        }

        return this.updatedTimeString;
    }

    constructor(xmlItem: ChildNode) {
        for (let i = 0; i < xmlItem.childNodes.length; i++) {
            let tempChild = xmlItem.childNodes[i] as Element;
            switch (xmlItem.childNodes[i].nodeName) {
                case 'id':
                    this.id = tempChild.innerHTML;
                    break;
                case 'published':
                    this.published = tempChild.innerHTML;
                    let tempPublishedTimeStamp = this.getTimestamp(this.published);
                    if (tempPublishedTimeStamp) {
                        this.publishedTimestamp = tempPublishedTimeStamp;
                    }
                    break;
                case 'updated':
                    this.updated = tempChild.innerHTML;
                    let tempUpdatedTimeStamp = this.getTimestamp(this.updated);
                    if (tempUpdatedTimeStamp) {
                        this.updatedTimestamp = tempUpdatedTimeStamp;
                        this.updatedTimeString = this.getTimeString(tempUpdatedTimeStamp);
                    }
                    break;
                case 'link':
                    this.link = tempChild.getAttribute('href') as string;
                    break;
                case 'title':
                    this.title = tempChild.innerHTML;
                    break;
                case 'media:thumbnail':
                    this.avatar = tempChild.getAttribute('url') as string;
                    break;
                case 'author':
                    if (tempChild.getElementsByTagName('name')) {
                        this.author.name = tempChild.getElementsByTagName('name')[0].innerHTML;
                    }

                    if (tempChild.getElementsByTagName('uri')) {
                        this.author.uri = tempChild.getElementsByTagName('uri')[0].innerHTML;
                    }
                    break;
            }
        }
    }

    public getTimestamp(timeString: string): number|null {
        let tempArray = timeString.split('T');
        if (tempArray.length === 2) {
            let front = tempArray[0].split('-');
            if (front.length === 3) {
                let tempTimeStampStr = front.join('/');
                let behind = tempArray[1].split('Z')[0];
                if (behind) {
                    tempTimeStampStr += (' ' + behind.substring(0,8));
                } else {
                    tempTimeStampStr += ' 00:00:00';
                }

                let tempTimeStamp = new Date(tempTimeStampStr).getTime();
                let timezoneOffset = new Date().getTimezoneOffset();
                tempTimeStamp -= timezoneOffset * 60 * 1000;
                return tempTimeStamp;
            }
        }

        return null;
    }

    public getTimeString(timestamp: number): string {
        let tempDate = new Date(timestamp);
        let year = tempDate.getFullYear(),
            month = tempDate.getMonth(),
            day = tempDate.getDay(),
            hours = tempDate.getHours(),
            min = tempDate.getMinutes();
        let nowDate = new Date();
        let nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth(),
            nowDay = nowDate.getDay();
        if (year === nowYear) {
            if (month === nowMonth && day === nowDay) {
                return hours + ':' + min;
            } else {
                return month + '月' + day + '日';
            }
        } else {
            return year + '年' + month + '月' + day + '日';
        }
    }
}

export default GitHubTimelineItem;
