const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./resources/application.properties');
const DateUtil = require('./DateUtil.js');

const logFileName = properties.get('logFileName');

module.exports = {
    watch: async function(targetFolderPath, uploadImgurThenPostFbFunc){
        const watcher = chokidar.watch(targetFolderPath, {ignored: '*.txt', ignoreInitial: true, depth: 0});
        watcher.on('ready', async () => {
            let todayFilePath = this.scanThenGetTodayFile(targetFolderPath);
            if(todayFilePath){
                await uploadImgurThenPostFbFunc(todayFilePath);
                this.logAndArchiveFile(todayFilePath);
            }
        })
        .on('add', async addedFilePath => {
            if(this.isTodayFile(addedFilePath)){
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
    }

}