const express = require('express');
const router = express.Router();
const db = require('../mockDb'); // 使用 mock 数据模块

router.get('/', async (req, res) => {
  const { sourceCurrency, targetCurrency, amount = 1, dateTime, isRealtime } = req.query;

  if (!sourceCurrency || !targetCurrency) {
    return res.status(400).json({ error: 'Missing sourceCurrency or targetCurrency' });
  }

  try {
    // 使用 mockDb 查询 source 汇率
    const [sourceResult] = await db.execute(
      `SELECT Exchange_rate FROM Currency WHERE Currency_name = ?`,
      [sourceCurrency]
    );

    // 使用 mockDb 查询 target 汇率
    const [targetResult] = await db.execute(
      `SELECT Exchange_rate FROM Currency WHERE Currency_name = ?`,
      [targetCurrency]
    );

    if (sourceResult.length === 0 || targetResult.length === 0) {
      return res.status(404).json({ error: 'Currency not found in mock data' });
    }

    const rateSource = sourceResult[0].Exchange_rate;
    const rateTarget = targetResult[0].Exchange_rate;

    const exchangeRate = rateTarget / rateSource;
    const convertedAmount = (amount * exchangeRate).toFixed(4);

    res.json({
      sourceCurrency,
      targetCurrency,
      baseCurrency: 'USD',
      rateSourceToUSD: rateSource,
      rateTargetToUSD: rateTarget,
      exchangeRate: exchangeRate.toFixed(6),
      convertedAmount,
      isRealtime: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mock conversion failed' });
  }
});

module.exports = router;
