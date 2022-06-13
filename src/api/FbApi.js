const axios = require('axios');

const fbApiEndpoint = 'https://graph.facebook.com/';

module.exports = {
    me: function (userToken){
        return axios.get(fbApiEndpoint + 'me?access_token=' + userToken)
            .then(function(response){
                console.log('FbApi.me');
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data;
            });
    },
    debugToken: function (inputToken, userToken){
        return axios.get(fbApiEndpoint + 'debug_token?input_token=' + inputToken + '&access_token=' + userToken)
            .then(function(response){
                console.log('FbApi.debugToken');
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data;
            });
    },
    longLiveUserToken: function (appId, appSecret, userToken){
        return axios.get(fbApiEndpoint + 'oauth/access_token?grant_type=fb_exchange_token&client_id=' + appId + 
            '&client_secret=' + appSecret + '&fb_exchange_token=' + userToken)
            .then(function(response){
                console.log('FbApi.longLiveUserToken');
                console.log(response.data);
                let access_token = response.data.access_token;
                return access_token;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data;
            });
    },
    pageAccessToken: function(pageId, userToken){
        return axios.get(fbApiEndpoint + pageId + '/?fields=access_token&access_token=' + userToken)
            .then(function(response){
                console.log('FbApi.pageAccessToken');
                console.log(response.data);
                let access_token = response.data.access_token
                return access_token;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data;
            });
    },
    photoWithCaptionNow: function(pageId, url, caption, pageAccessToken){
        return axios.post(fbApiEndpoint + pageId + '/photos?url=' + url + '&caption=' + encodeURIComponent(caption) + '&access_token=' + pageAccessToken)
            .then(function(response){
                console.log('FbApi.photoWithCaptionNow');
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data
            });
    },
    /***
     * scheduleTime: Unix Timestamp second
     */
    photoWithCaptionScheduled: function(pageId, url, caption, scheduleTime, pageAccessToken){
        return axios.post(fbApiEndpoint + pageId + '/photos?url=' + url + '&caption=' + encodeURIComponent(caption) + 
        '&published=false&scheduled_publish_time=' + scheduleTime + '&access_token=' + pageAccessToken)
            .then(function(response){
                console.log('FbApi.photoWithCaptionScheduled');
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                console.log('FbApi.photoWithCaptionScheduled failed');
                console.log(error.response.data);
                return error.response.data;
            });
    },
    getFeeds: function(pageId, pageAccessToken){
        return axios.get(fbApiEndpoint + pageId + '/feed' + '/?access_token=' + pageAccessToken)
            .then(function(response){
                console.log('FbApi.feed');
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                console.log(error.response.data);
                return error.response.data;
            });
    }
};


