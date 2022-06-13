module.exports = {
    getNowyyyymmdd: function(){
        let now = new Date();
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let date = now.getDate().toString().padStart(2, '0');
        return year + month + date;
    },
    appendDateTag: function(caption){
        let now = new Date();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();
        return caption.concat(' ', '#', month, '月', date, '日');
    }
}