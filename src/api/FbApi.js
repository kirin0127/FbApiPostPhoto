const axios = require('axios');
const LoggerFactory = require('../util/LoggerFactory.js');

const logger = LoggerFactory.getLogger('FbApi.js');

const fbApiEndpoint = 'https://graph.facebook.com/';

module.exports = {
    me: function (userToken){
        return axios.get(fbApiEndpoint + 'me?access_token=' + userToken)
            .then(function(response){
                logger.info('FbApi.me success\n' + JSON.stringify(response.data));
                return response.data;
            })
            .catch(function (error) {
                logger.error('FbApi.me failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.me failed';
            });
    },
    debugToken: function (inputToken, userToken){
        return axios.get(fbApiEndpoint + 'debug_token?input_token=' + inputToken + '&access_token=' + userToken)
            .then(function(response){
                logger.info('FbApi.debugToken success\n' + JSON.stringify(response.data));
                return response.data;
            })
            .catch(function (error) {
                logger.error('FbApi.debugToken failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.debugToken failed';
            });
    },
    longLiveUserToken: function (appId, appSecret, userToken){
        return axios.get(fbApiEndpoint + 'oauth/access_token?grant_type=fb_exchange_token&client_id=' + appId + 
            '&client_secret=' + appSecret + '&fb_exchange_token=' + userToken)
            .then(function(response){
                logger.info('FbApi.longLiveUserToken success\n' + JSON.stringify(response.data));
                let access_token = response.data.access_token;
                return access_token;
            })
            .catch(function (error) {
                logger.error('FbApi.longLiveUserToken failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.longLiveUserToken failed';
            });
    },
    pageAccessToken: function(pageId, userToken){
        return axios.get(fbApiEndpoint + pageId + '/?fields=access_token&access_token=' + userToken)
            .then(function(response){
                logger.info('FbApi.pageAccessToken success\n' + JSON.stringify(response.data));
                let access_token = response.data.access_token
                return access_token;
            })
            .catch(function (error) {
                logger.error('FbApi.pageAccessToken failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.pageAccessToken failed';
            });
    },
    photoWithCaptionNow: function(pageId, url, caption, pageAccessToken){
        return axios.post(fbApiEndpoint + pageId + '/photos?url=' + url + '&caption=' + encodeURIComponent(caption) + '&access_token=' + pageAccessToken)
            .then(function(response){
                logger.info('FbApi.photoWithCaptionNow success\n' + JSON.stringify(response.data));
                return response.data;
            })
            .catch(function (error) {
                logger.error('FbApi.photoWithCaptionNow failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.photoWithCaptionNow failed';
            });
    },
    /***
     * scheduleTime: Unix Timestamp second
     */
    photoWithCaptionScheduled: function(pageId, url, caption, scheduleTime, pageAccessToken){
        return axios.post(fbApiEndpoint + pageId + '/photos?url=' + url + '&caption=' + encodeURIComponent(caption) + 
        '&published=false&scheduled_publish_time=' + scheduleTime + '&access_token=' + pageAccessToken)
            .then(function(response){
                logger.info('FbApi.photoWithCaptionScheduled success\n' + JSON.stringify(response.data));
                return response.data;
            })
            .catch(function (error) {
                logger.error('FbApi.photoWithCaptionScheduled failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.photoWithCaptionScheduled failed';
            });
    },
    getFeeds: function(pageId, pageAccessToken){
        return axios.get(fbApiEndpoint + pageId + '/feed' + '/?access_token=' + pageAccessToken)
            .then(function(response){
                logger.info('FbApi.getFeeds success\n' + JSON.stringify(response.data));
                return response.data;
            })
            .catch(function (error) {
                logger.error('FbApi.getFeeds failed\n' + JSON.stringify(error.response.data));
                throw 'FbApi.getFeeds failed';
            });
    }
};


