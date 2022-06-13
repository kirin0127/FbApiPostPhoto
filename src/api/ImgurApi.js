const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const IMGUR_ACCOUNT_USERNAME = process.env.IMGUR_ACCOUNT_USERNAME;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_CLIENT_SECRET = process.env.IMGUR_CLIENT_SECRET;
const IMGUR_REFRESH_TOKEN = process.env.IMGUR_REFRESH_TOKEN;
const IMGUR_ACCESS_TOKEN = process.env.IMGUR_ACCESS_TOKEN;

const imgurApiEndpoint = 'https://api.imgur.com/3/';

var constructImageFormData = async function(imageFilePath, paramMap){
    let form = await constructTextFormData(paramMap);
    let fn = path.basename(imageFilePath);
    form.append('image', fs.readFileSync(imageFilePath), fn);
    form.append('name', fn);
    return new Promise(resolve => resolve(form));
}

var constructTextFormData = function(paramMap){
    let form = new FormData();
    Object.keys(paramMap).forEach(k => form.append(k, paramMap[k]));
    return new Promise(resolve => resolve(form));
}


module.exports = {
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
            console.log('imgurApi.uploadImage');
            console.log(response.data);
            return response.data;
        }).catch(function (error) {
            console.log('imgurApi.uploadImage failed');
            console.log(error.response.data);
            return error.response.data;
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
                console.log('imgurApi.albums');
                console.log(response.data);
                return response.data;
        }).catch(
            function (error) {
                console.log('imgurApi.uploadImage failed');
                console.log(error.response.data);
                return error.response.data;
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
                console.log('imgurApi.createAlbum');
                console.log(response.data);
                return response.data;
        }).catch(
            function (error) {
                console.log('imgurApi.uploadImage failed');
                console.log(error.response.data);
                return error.response.data;
        });
    },
}