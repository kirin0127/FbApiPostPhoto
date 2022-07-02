const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./resources/application.properties');
const DateUtil = require('./DateUtil.js');
const LoggerFactory = require('../util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('FileWatcher.js');

const logFileName = properties.get('uploadHistoryFileName');

module.exports = {
    watch: async function(targetFolderPath, postCaption, uploadImgurThenPostFbFunc){
        const watcher = chokidar.watch(targetFolderPath, {ignored: '*.txt', ignoreInitial: true, depth: 0});
        watcher.on('ready', async () => {
            logger.info('FileWatcher watch on ready');
            let todayFilePath = this.scanThenGetTodayFile(targetFolderPath);
            if(todayFilePath){
                logger.info('todayFilePath: ' + todayFilePath);
                await uploadImgurThenPostFbFunc(todayFilePath, postCaption);
                this.logAndArchiveFile(todayFilePath);
            }
        })
        .on('add', async addedFilePath => {
            logger.info('FileWatcher watch on add');
            if(this.isTodayFile(addedFilePath)){
                logger.info('todayFilePath: ' + addedFilePath);
                await uploadImgurThenPostFbFunc(addedFilePath);
                this.logAndArchiveFile(addedFilePath);
            }
        })
    },
    isTodayFile(filePath){
        // get current yyyymmdd, and determine input filePath is current yyyymmdd file name or not.
        let pathParsed = path.parse(filePath);
        let currentDate = DateUtil.getNowyyyymmdd();
        if(pathParsed.name === currentDate){
            return true;
        }
        return false;
    },
    scanThenGetTodayFile: function(targetFolderPath){
        // get current yyyymmdd, and scan all files whether current yyyymmdd file name exists or not.
        let todayFilePath = null;
        fs.readdirSync(targetFolderPath).forEach(fileName => {
            if(this.isTodayFile(fileName)){
                todayFilePath = path.resolve(targetFolderPath, fileName);
            };
        });
        return todayFilePath;
    },
    /**
     * Files in targetFolderPath must be named as yyyyMMdd.
     * 
     * @param string targetFolderPath 
     * @param string scheduleAthhmm 
     * @param function uploadImgurThenPostFbFunc 
     */
    scheduleAllFiles: async function(targetFolderPath, postCaption, scheduleAthhmm, uploadImgurThenPostFbFunc){
        let filePaths = this.scanAllThenGetFiles(targetFolderPath);
        for(let fp of filePaths){
            let parsedPath = path.parse(fp);
            await uploadImgurThenPostFbFunc(fp, postCaption, parsedPath.name, scheduleAthhmm);
            this.logAndArchiveFile(fp);
        }
    },
    scheduleAllFilesEveryFixedMin: async function(targetFolderPath, postCaption, fixedMin, uploadImgurThenPostFbFunc){
        let fixedMinInSecond = fixedMin * 60;
        let filePaths = this.scanAllThenGetFiles(targetFolderPath);
        let unixSecond = Math.floor(new Date().getTime() / 1000);
        for(let fp of filePaths){
            unixSecond += fixedMinInSecond;
            await uploadImgurThenPostFbFunc(fp, postCaption, unixSecond);
            this.logAndArchiveFile(fp);
        }
    },
    scanAllThenGetFiles: function(targetFolderPath){
        let filePaths = [];
        let filePathsStr = '';
        fs.readdirSync(targetFolderPath).forEach(fileName => {
            if(fileName !== 'archive' && fileName !== 'history.txt'){
                filePaths.push(path.resolve(targetFolderPath, fileName));
                filePathsStr = filePathsStr.concat(path.resolve(targetFolderPath, fileName), '\n');
            }
        });
        logger.info('FileWatcher.scanAllThenGetFiles scanned ' + filePaths.length + ' files\n' + filePathsStr);
        return filePaths;
    },
    logAndArchiveFile: function(filePath){
        let pathParsed = path.parse(filePath);
        let logFilePath = path.resolve(pathParsed.dir, logFileName);
        let archivedFileName = pathParsed.name + '_archived' + pathParsed.ext;
        let archivedFolderPath = path.resolve(pathParsed.dir, 'archive');
        let archiveFilePath = path.resolve(archivedFolderPath, archivedFileName);
        if (!fs.existsSync(archivedFolderPath)){
            fs.mkdirSync(archivedFolderPath, { recursive: true });
        }
        fs.appendFileSync(logFilePath, pathParsed.base + ' uploaded at ' + new Date() + '\r\n');
        fs.renameSync(filePath, archiveFilePath);
        logger.info('FileWatcher.logAndArchiveFile: \n' + filePath);
    }

}