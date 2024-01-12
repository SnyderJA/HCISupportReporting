import moment from 'moment';

export const DATE_SHOW_UI = 'MM/DD/YYYY';
export const DATE_TIME_SHOW_UI = 'DD/MM/YYYY HH:mm';
export const DATE_PARAM_REQ = 'YYYY-MM-DD';
export const DATE_TIME_PARAM_REQ = 'YYYY-MM-DD HH:mm';

export const moneyToString = (value: string | number | undefined) =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const stringToMoney = (value: string | undefined) =>
  value ? value.replace(/\$\s?|(,*)/g, '') : '';

export const numberToMoney = (value: number) =>
  value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

export const dateToString = (date: moment.MomentInput, format = DATE_SHOW_UI) =>
  moment(date).format(format);

export const dateTimeToString = (date: moment.MomentInput, format = DATE_TIME_SHOW_UI) =>
  moment(date).format(format);

export const dateToStringParamReq = (date: moment.MomentInput, format?: string) => {
  const dateMoment = moment(date);
  return dateMoment.isValid() ? dateMoment.format(format || DATE_PARAM_REQ) : '';
};

export const stringParamReqToDate = (param: moment.MomentInput, format?: string) => {
  const dateMoment = moment(param, format || DATE_PARAM_REQ);
  return dateMoment.isValid() ? dateMoment : null;
};

export const strDateReqToStrUi = (param: moment.MomentInput) => {
  return dateToString(stringParamReqToDate(param));
};

export const roundUpDouble = (num: number, n = 2) => {
  if (!num) {
    return 0;
  }
  const x = 10 ** n;
  return Math.round(num * x) / x;
};
// helloThereMister => Hello There Mister
export const camelCaseToSentenceCase = (camelCaseText: string) => {
  if (!camelCaseText) {
    return '';
  }
  const result = camelCaseText.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

export const capitalizeFirstLetter = (text: string) => {
  if (!text) return;
  const newText = text.toLowerCase();
  return newText.charAt(0).toUpperCase() + newText.slice(1);
};
