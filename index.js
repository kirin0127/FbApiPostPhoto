require('dotenv').config()
const PropertiesReader = require('properties-reader');
const FbApi = require('./src/api/FbApi.js');
const ImgurApi = require('./src/api/ImgurApi.js');
const FbService = require('./src/service/FbService.js');
const ImgurService = require('./src/service/ImgurService.js');
const DateUtil = require('./src/util/DateUtil.js');
const FileWatcher = require('./src/util/FileWatcher.js');

const properties = PropertiesReader('./resources/application.properties');

const heartCalendarPhotoCaption = properties.get('heartCalendarPhotoCaption');
const targetFolderPath = properties.get('targetFolderPath');

async function uploadImgurThenPostFb(imageFilePath){
    const uploadResponse = await ImgurService.uploadImageToAlbum(imageFilePath);
    let imageUrl = uploadResponse.data.link;
    await FbService.postPhotoNow(imageUrl, DateUtil.appendDateTag(heartCalendarPhotoCaption));
}

FileWatcher.watch(targetFolderPath, uploadImgurThenPostFb);
