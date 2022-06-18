const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const LoggerFactory = require('../util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('ImgurApi.js');

const IMGUR_ACCOUNT_USERNAME = process.env.IMGUR_ACCOUNT_USERNAME;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_CLIENT_SECRET = process.env.IMGUR_CLIENT_SECRET;
const IMGUR_REFRESH_TOKEN = process.env.IMGUR_REFRESH_TOKEN;
const IMGUR_ACCESS_TOKEN = process.env.IMGUR_ACCESS_TOKEN;

const imgurApiEndpoint = 'https://api.imgur.com/3/';

var constructImageFormData = async function(imageFilePath, paramMap){
    let form = await constructTextFormData(paramMap);
    let fn = path.basename(imageFilePath);
    try{
        form.append('image', fs.readFileSync(imageFilePath), fn);
        form.append('name', fn);
    }catch(err){
        logger.error(err.stack);
    }
    return new Promise(resolve => resolve(form));
}

var constructTextFormData = function(paramMap){
    let form = new FormData();
    Object.keys(paramMap).forEach(k => form.append(k, paramMap[k]));
    return new Promise(resolve => resolve(form));
}


module.exports = {
    getAccessToken: async function(refreshToken, clientId, clientSecret){
        let paramMap = {refresh_token: IMGUR_REFRESH_TOKEN, client_id: IMGUR_CLIENT_ID, client_secret: IMGUR_CLIENT_SECRET, grant_type: 'refresh_token'};
        let form = await constructTextFormData(paramMap);
        return axios.post('https://api.imgur.com/' + 'oauth2/token', form, {
            mimeType: 'multipart/form-data'
        }).then(function(response){
            logger.info('ImgurApi.getAccessToken success\n' + JSON.stringify(response.data));
            return response.data;
        }).catch(function (error) {
            logger.error('ImgurApi.getAccessToken failed\n' + JSON.stringify(error.response.data));
            throw 'ImgurApi.uploadImage failed'
        });
    },
    uploadImage: async function(imageFilePath, title, albumId){
        let paramMap = !albumId ? {title: title} : {title: title, album: albumId};
        let form = await constructImageFormData(imageFilePath, paramMap);
        return axios.post(imgurApiEndpoint + 'upload', form, {
            headers: {
                // Authorization: "Client-ID 546c25a59c58ad7"
                Authorization: "Bearer " + IMGUR_ACCESS_TOKEN
            },
            mimeType: 'multipart/form-data',
        }).then(function(response){
            logger.info('ImgurApi.uploadImage success\n' + JSON.stringify(response.data));
            return response.data;
        }).catch(function (error) {
            logger.error('ImgurApi.uploadImage failed\n' + JSON.stringify(error.response.data));
            throw 'ImgurApi.uploadImage failed'
        });
    },
    getAlbums: function(username){
        return axios.get(imgurApiEndpoint + 'account/' + username + '/albums/', {
            headers: {
                // Authorization: "Client-ID " + IMGUR_CLIENT_ID // this will act like anonymous user (can't see hidden albums)
                Authorization: "Bearer " + IMGUR_ACCESS_TOKEN
            },
        }).then(
            function(response){
                logger.info('ImgurApi.getAlbums success');
                return response.data;
        }).catch(
            function (error) {
                logger.error('ImgurApi.getAlbums failed\n' + JSON.stringify(error.response.data));
                throw 'ImgurApi.getAlbums failed'
                
        });
    },
    createAlbum: async function(title, description){
        if(!description){
            description = 'This album was created by ImgurApi.';
        }
        let paramMap = {
            title: title,
            description: description
        };
        let form = await constructTextFormData(paramMap);
        return axios.post(imgurApiEndpoint + 'album', form, {
            headers: {
                // Authorization: "Client-ID 546c25a59c58ad7"
                Authorization: "Bearer " + IMGUR_ACCESS_TOKEN
            },
            mimeType: 'multipart/form-data',
        }).then(
            function(response){
                logger.info('ImgurApi.createAlbum success\n' + JSON.stringify(response.data));
                return response.data;
        }).catch(
            function (error) {
                logger.error('ImgurApi.createAlbum failed\n' + JSON.stringify(error.response.data));
                throw 'ImgurApi.createAlbum failed';
        });
    },
}