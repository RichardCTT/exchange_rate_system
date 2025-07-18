const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/convert?sourceCurrency=EUR&targetCurrency=JPY&amount=100&dateTime=2025-07-18T12:00:00Z&isRealtime=true
router.get('/', async (req, res) => {
  const { sourceCurrency, targetCurrency, amount, dateTime, isRealtime } = req.query;

  if (!sourceCurrency || !targetCurrency || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const timeCondition = isRealtime === 'true'
    ? `(SELECT MAX(Time) FROM Currency)`
    : `?`;

  try {
    // 查询 sourceCurrency 对 USD 的汇率
    const [sourceResult] = await db.execute(
      `SELECT Exchange_rate FROM Currency WHERE Currency_name = ? AND Time = ${timeCondition}`,
      isRealtime === 'true' ? [sourceCurrency] : [sourceCurrency, dateTime]
    );

    // 查询 targetCurrency 对 USD 的汇率
    const [targetResult] = await db.execute(
      `SELECT Exchange_rate FROM Currency WHERE Currency_name = ? AND Time = ${timeCondition}`,
      isRealtime === 'true' ? [targetCurrency] : [targetCurrency, dateTime]
    );

    if (sourceResult.length === 0 || targetResult.length === 0) {
      return res.status(404).json({ error: 'One or both currencies not found' });
    }

    const rateSourceToUSD = sourceResult[0].Exchange_rate;
    const rateTargetToUSD = targetResult[0].Exchange_rate;

    // 计算 sourceCurrency → USD → targetCurrency
    const exchangeRate = rateTargetToUSD / rateSourceToUSD;
    const convertedAmount = (amount * exchangeRate).toFixed(4);

    res.json({
      sourceCurrency,
      targetCurrency,
      exchangeRate: exchangeRate.toFixed(6),
      convertedAmount,
      baseCurrency: 'USD',
      rateSourceToUSD: rateSourceToUSD.toFixed(6),
      rateTargetToUSD: rateTargetToUSD.toFixed(6),
      dateTime: isRealtime === 'true' ? new Date().toISOString() : dateTime,
      isRealtime: isRealtime === 'true'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
