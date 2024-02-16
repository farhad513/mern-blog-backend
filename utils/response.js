module.exports.responseReturn = (res, code, data) => {
  return res.status(code).send(data);
};
