const FbApi = require('../api/FbApi.js');

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_LONG_LIVE_PAGE_ACCESS_TOKEN = process.env.FB_LONG_LIVE_PAGE_ACCESS_TOKEN;

module.exports = {
    postPhotoNow: async function(imageLink, postCaption){
        await FbApi.photoWithCaptionNow(FB_PAGE_ID, imageLink, postCaption, FB_LONG_LIVE_PAGE_ACCESS_TOKEN)
    },
    postPhotoScheduled: async function(imageLink, postCaption, scheduledDateTime){
        let scheduleTime = this.toUnixSecond(scheduledDateTime);
        await FbApi.photoWithCaptionScheduled(FB_PAGE_ID, imageLink, postCaption, scheduleTime, FB_LONG_LIVE_PAGE_ACCESS_TOKEN);
    },
    /**
     * @param datetime: string
     * format: yyyymmddhhmmss
     */
    toUnixSecond: function(datetime){
        let year = datetime.substring(0, 4);
        let month = datetime.substring(4, 6);
        let date = datetime.substring(6, 8);
        let hour = datetime.substring(8, 10);
        let minute = datetime.substring(10, 12);
        let second = datetime.substring(12, 14);
        let dateTimeStr = year + '-' + month + '-' + date + 'T' + hour + ':' + minute + ':' + second + '.000+08:00';
        let UnixMilliseconds = Date.parse(dateTimeStr);
        return UnixMilliseconds / 1000;
    }
}