require('dotenv').config()
const path = require('path');
const PropertiesReader = require('properties-reader');
const FbApi = require('./src/api/FbApi.js');
const ImgurApi = require('./src/api/ImgurApi.js');
const FbService = require('./src/service/FbService.js');
const ImgurService = require('./src/service/ImgurService.js');
const DateUtil = require('./src/util/DateUtil.js');
const FileWatcher = require('./src/util/FileWatcher.js');
const LoggerFactory = require('./src/util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('index.js');
const properties = PropertiesReader('./resources/application.properties');

const heartCalendarPhotoCaption = properties.get('heartCalendarPhotoCaption');
const targetFolderPath = properties.get('targetFolderPath');


// FileWatcher.watch(targetFolderPath, heartCalendarPhotoCaption, FbService.uploadImgurThenPostFbNow);

// FileWatcher.scheduleAllFilesEveryFixedMin(targetFolderPath, heartCalendarPhotoCaption, 10, FbService.uploadImgurThenPostFbScheduledAtUnixSec);

FileWatcher.scheduleAllFiles(targetFolderPath, heartCalendarPhotoCaption, '12:00', FbService.uploadImgurThenPostFbScheduledAtDatetime);
