import moment from 'moment';
import 'moment/locale/id';
// format of date time
const formatDateTime = 'YYYY-MM-DDTHH:mm:ss.SSSS';
// moment.locale('id');

export const convertDateTime = (dateValue, isUtc) => {
    const date = new Date();
  
    if (typeof dateValue === 'string') {
      if (isUtc)
        return moment(dateValue, formatDateTime).add(
          moment(date).utcOffset(),
          'minutes',
        );
      return moment(dateValue, formatDateTime);
    }
  
    if (isUtc)
      return dateValue
        .add(moment(date).utcOffset(), 'minutes')
        .format(formatDateTime);
    return dateValue.format(formatDateTime);
    
  };
export const convertToLocale = (dateValue,isDate) => {
  if(isDate)
    return moment.utc(dateValue).local().format('DD MMMM YYYY');
  return moment.utc(dateValue).local().format('HH:mm');
}

export const convertToDay = (dateValue) => {
  if(dateValue)
    return moment.utc(dateValue).local().format('DD MMMM YYYY');
}