export const getErrorDesc = statusCode => {
  switch (true) {
    case statusCode >= 400 && statusCode < 499:
      return 'error_desc_5XX';
    case statusCode >= 500 && statusCode < 599:
      return 'error_desc_5XX';
    default:
      return statusCode;
  }
};

export const getErrorApiDesc = err => {
  if (err.response) {
    if (typeof err.response.data === 'string') return err.response.data;
    return getErrorDesc(err.response.status);
  }
  return getErrorDesc(err.message);
};
