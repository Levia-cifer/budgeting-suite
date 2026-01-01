export function simpleForecast(transactions: any[], months = 6) {
  // Calculate average monthly savings (negative expenses are income)
  const now = new Date();
  const monthlyTotals: Record<string, number> = {};
  for (const t of transactions) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyTotals[key] = (monthlyTotals[key] || 0) + t.amount;
  }
  const vals = Object.values(monthlyTotals);
  const avg = vals.length ? vals.reduce((a,b) => a+b,0)/vals.length : 0;
  // project next `months` months using avg
  const forecast = [];
  for (let i=1;i<=months;i++) {
    const d = new Date(now.getFullYear(), now.getMonth()+i, 1);
    forecast.push({ month: d.toISOString().slice(0,7), expected: avg });
  }
  return { avgMonthly: avg, forecast };
}
