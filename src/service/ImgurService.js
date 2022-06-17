const path = require('path');
const ImgurApi = require('../api/ImgurApi.js');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./resources/application.properties');
const LoggerFactory = require('../util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('ImgurService.js');

const IMGUR_ACCOUNT_USERNAME = process.env.IMGUR_ACCOUNT_USERNAME;
const imgurAlbumTitle = properties.get('imgurAlbumTitle');

module.exports = {
    getAlbumIdByTitle: async function(albumTitle){
        let getAlbumsResponse = await ImgurApi.getAlbums(IMGUR_ACCOUNT_USERNAME);
        let filterByTitle = getAlbumsResponse.data.filter(album => album.title === albumTitle);
        if(!filterByTitle.length){
            logger.error('ImgurService.getAlbumIdByTitle\nImgur not found album: ' + albumTitle);
            let createdAlbumResponse = await ImgurApi.createAlbum(albumTitle);
            return createdAlbumResponse.data.id;    
        }
        let album = filterByTitle[0];
        return album.id;
    },
    uploadImageToAlbum: async function(imageFilePath){
        let albumId = await this.getAlbumIdByTitle(imgurAlbumTitle);
        let imageTitle = path.parse(imageFilePath).name;
        let uploadResponse = await ImgurApi.uploadImage(imageFilePath, imageTitle, albumId);
        return uploadResponse;
    }
}