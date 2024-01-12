const tableConfig = {
  getPaginationParam: (page, pageSize) => {
    return {
      page: page || 1, // antd page begin 1
      limit: pageSize,
    };
  },
  handleGetDataResponse: (res) => {
    const [, result] = res;
    return {
      content: result.data.data.data,
      total: result.data.data.totalItems,
    };
  },
};

export default tableConfig;
