(function () {
  'use strict';
  const root = document.getElementById('coinCalculator');
  if (!root) return;
  const value = key => Number(root.querySelector(`[data-calc="${key}"]`)?.value) || 0;
  const result = key => root.querySelector(`[data-calc-result="${key}"]`);
  function calculate() {
    const M = value('amount'), X = value('buyPrice'), S = value('sellPrice');
    const inFactor = 1 - value('taxIn') / 100, outFactor = 1 - value('taxOut') / 100, fixed = value('fixedCost');
    if (M <= 0 || X <= 0 || S <= 0 || inFactor <= 0 || outFactor <= 0) { result('breakEven').textContent = '请输入有效数值'; result('compare').textContent = '--'; result('profit').textContent = '--'; result('yield').textContent = '--'; result('status').textContent = '--'; return; }
    const netIncome = (M / S) * outFactor;
    const totalCost = M / (inFactor * X) + fixed;
    const profit = netIncome - totalCost;
    const denominator = ((M / S) * outFactor - fixed) * inFactor;
    const breakEven = denominator > 0 ? M / denominator : Infinity;
    result('breakEven').textContent = denominator > 0 ? `${breakEven.toFixed(2)} 万/元` : '无法平衡';
    result('compare').textContent = denominator > 0 ? (X > breakEven ? '✅ 高于（盈利）' : X < breakEven ? '❌ 低于（亏损）' : '⚖️ 等于（保本）') : '⚠️ 无法平衡';
    result('profit').textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(4)} 元`;
    result('yield').textContent = `${(profit / totalCost * 100).toFixed(2)}%`;
    result('status').textContent = profit > 0.0001 ? '🟢 盈利中' : profit < -0.0001 ? '🔴 亏损中' : '⚪ 保本';
    result('profit').className = profit >= 0 ? 'good' : 'bad'; result('yield').className = profit >= 0 ? 'good' : 'bad';
  }
  root.querySelectorAll('input').forEach(input => input.addEventListener('input', calculate));
  calculate();
})();
