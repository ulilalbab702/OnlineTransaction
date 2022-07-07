import moment from "moment";

export const formatCurrency = (price) => {
  if(price != undefined){
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }
};

export const formatVaNumber = (number) => {
  if(number != undefined){
    return `${number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ")}`;
  }
};

export const formatDate = (date) => {
  if(date != undefined){
    return moment
      .utc(date)
      .local()
      .format("DD MMM YYYY");
  }
};