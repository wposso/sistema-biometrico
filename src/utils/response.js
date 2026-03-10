const sendResponse = (res, arg1, message, data, error) => {
  let payload = {};
  
  if (typeof arg1 === 'object' && arg1 !== null) {
    payload = {
      code: arg1.code ?? 200,
      message: arg1.message ?? '',
      data: arg1.data ?? null,
      error: arg1.error ?? false
    };
  } else {    
    payload = {
      code: arg1 ?? 200,
      message: message ?? '',
      data: data ?? null,
      error: error ?? false
    };
  }

  return res.status(payload.code).json({
    ...payload,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  });
};

module.exports = sendResponse;