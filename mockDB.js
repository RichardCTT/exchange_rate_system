module.exports = {
  execute: async (query, params) => {
    const currency = params[0]; // sourceCurrency or targetCurrency

    // 固定模拟汇率（基于 USD）
    const mockRates = {
      USD: 1.0,
      EUR: 0.85,
      JPY: 110.0,
      CNY: 7.25,
      SGD: 1.35
    };

    if (!mockRates[currency]) {
      return [[]]; // 返回空数组表示查询无结果
    }

    return [[{ Exchange_rate: mockRates[currency] }]];
  }
};
