const paginate = async (model, conditions = {}, page = 1, pageSize = 10) => {
  const numericPage = parseInt(page, 10);
  const numericPageSize = parseInt(pageSize, 10);
  const offset = (numericPage - 1) * numericPageSize;

  const { count, rows: data } = await model.findAndCountAll({
    ...conditions,
    offset,
    limit: numericPageSize,
  });

  return {
    currentPage: numericPage,
    totalPages: Math.ceil(count / numericPageSize),
    pageSize: numericPageSize,
    totalItems: count,
    data,
  };
};

module.exports = paginate;
