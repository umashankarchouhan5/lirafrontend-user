import moment from 'moment';

class DateUtil {
    constructor() {
        this.format = '';
        this.formatWithTime = '';
        this.formatWithSlash = '';
        this.formatTime = '';
        this.formatDateRangeValue = '';
    }
    setFormat(format) {
        this.format = format;
    }
    setFormatWithTime(format) {
        this.formatWithTime = format;
    }
    setFormatWithSlash(format) {
        this.formatWithSlash = format;
    }
    setFormatWithTime(format) {
        this.formatTime = format;
    }
    setFormatDateRange(format){
        this.formatDateRangeValue = format;
    }
    formatDate(date) {
        return moment(date).format(this.format);
    }
    formatDateRange(date) {
        return `${moment(date[0]).format(this.formatDateRangeValue)} - ${moment(date[1]).format(this.formatDateRangeValue )}`;
    }
    formatDateWithTime(date) {
        return moment(date).format(this.formatWithTime);
    }
    formatDateWithSlash(date) {
        return moment(date).format(this.formatWithSlash);
    }
    formatWithTime(time){
        return moment(time).format(this.formatTime);
    }
    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}

export default new DateUtil();

