const {mockRates, mockId} = require('./mock/mockRates')

console.log( mockRates)

module.exports = {
  execute: async (query, params) => {
    const currency = params[0]; // sourceCurrency or targetCurrency

    

    if (!mockRates[currency]) {
      return [[]]; // 返回空数组表示查询无结果
    }

    return [[{ Exchange_rate: mockRates[currency] }]];
  }
};
