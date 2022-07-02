module.exports = {
    getNowyyyymmdd: function(){
        let now = new Date();
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let date = now.getDate().toString().padStart(2, '0');
        return year + month + date;
    },
    appendDateTag: function(caption, unixSecond){
        let dateObj = new Date(unixSecond * 1000);
        let month = (dateObj.getMonth() + 1).toString();
        let date = dateObj.getDate().toString();
        return caption.concat(' ', '#', month, '月', date, '日');
    },
    getUnixTimestampSecond: function(yyyyMMdd, hhmm){
        let year = yyyyMMdd.substring(0, 4);
        let month = parseInt(yyyyMMdd.substring(4, 6)) - 1;
        let date = yyyyMMdd.substring(6, 8);
        let hour = hhmm.substring(0, 2);
        let minute = hhmm.substring(3, 5);
        let dateObj = new Date(year, month, date, hour, minute);
        return Math.floor(dateObj.getTime() / 1000);
    },
    
}