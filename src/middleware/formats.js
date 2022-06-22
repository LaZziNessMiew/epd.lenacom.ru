export function minutNazadFormat(time) {
    let newDate = new Date(time)
    let curDate = new Date()

    var delta = Math.abs(newDate - curDate) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return (days != 0 ? `${days} д` : (hours != 0 ? `${hours} ч` : (minutes != 0 ? `${minutes} м` : '1 м')))
}

export function convertStampDate(time) {

    let date = new Date(time)

    // Months array
    var months_arr = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    // Convert timestamp to milliseconds
    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // final date
    var convdataTime = day + ' ' + month + ',' + ' ' + hours + ':' + minutes.substr(-2);
    return convdataTime;
}

export function idDate(t) {
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear().toString().slice(-2);
    return `${year}${month}${date}`;
}