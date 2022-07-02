const path = require('path');
const FbApi = require('../api/FbApi.js');
const ImgurService = require('./ImgurService.js');
const DateUtil = require('../util/DateUtil.js');
const LoggerFactory = require('../util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('FbService.js');

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_LONG_LIVE_PAGE_ACCESS_TOKEN = process.env.FB_LONG_LIVE_PAGE_ACCESS_TOKEN;

module.exports = {
    postPhotoNow: async function(imageLink, postCaption){
        await FbApi.photoWithCaptionNow(FB_PAGE_ID, imageLink, postCaption, FB_LONG_LIVE_PAGE_ACCESS_TOKEN)
    },
    postPhotoScheduled: async function(imageLink, postCaption, scheduledUnixSecond){
        await FbApi.photoWithCaptionScheduled(FB_PAGE_ID, imageLink, postCaption, scheduledUnixSecond, FB_LONG_LIVE_PAGE_ACCESS_TOKEN);
    },
    uploadImgurThenPostFbNow: async function uploadImgurThenPostFbNow(imageFilePath, postCaption){
        let parsedPath = path.parse(imageFilePath);
        const uploadResponse = await ImgurService.uploadImageToAlbum(imageFilePath);
        let imageUrl = uploadResponse.data.link;
        let nowTime = Math.floor(new Date().getTime() / 1000);
        await module.exports.postPhotoNow(imageUrl, DateUtil.appendDateTag(postCaption, nowTime));
        logger.info('FB request: filename=' + parsedPath.base + ' imageUrl=' + imageUrl);
    },
    uploadImgurThenPostFbScheduledAtUnixSec: async function uploadImgurThenPostFbScheduledAtUnixSec(imageFilePath, postCaption, scheduleAtUnixSecond){
        let parsedPath = path.parse(imageFilePath);
        const uploadResponse = await ImgurService.uploadImageToAlbum(imageFilePath);
        let imageUrl = uploadResponse.data.link;
        await module.exports.postPhotoScheduled(imageUrl, DateUtil.appendDateTag(postCaption, scheduleAtUnixSecond), scheduleAtUnixSecond);
        logger.info('FB request: filename=' + parsedPath.base + ' imageUrl=' + imageUrl + ' scheduledDateTime=' + new Date(scheduleAtUnixSecond * 1000));
    },
    uploadImgurThenPostFbScheduledAtDatetime: async function uploadImgurThenPostFbScheduled(imageFilePath, postCaption, yyyyMMdd, hhmm){
        let parsedPath = path.parse(imageFilePath);
        let scheduledDateTimeUnixSec = DateUtil.getUnixTimestampSecond(yyyyMMdd, hhmm);
        const uploadResponse = await ImgurService.uploadImageToAlbum(imageFilePath);
        let imageUrl = uploadResponse.data.link;
        await module.exports.postPhotoScheduled(imageUrl, DateUtil.appendDateTag(postCaption, scheduledDateTimeUnixSec), scheduledDateTimeUnixSec);
        logger.info('FB request: filename=' + parsedPath.base + ' imageUrl=' + imageUrl + ' scheduledDateTime=' + new Date(scheduledDateTimeUnixSec * 1000));
    }
}