import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const t = await fetch('http://localhost:4000/transactions');
      setTransactions(await t.json());
      const b = await fetch('http://localhost:4000/budgets');
      setBudgets(await b.json());
      const f = await fetch('http://localhost:4000/forecast');
      setForecast(await f.json());
    })();
  }, []);

  const total = transactions.reduce((s,tx) => s + tx.amount, 0);

  return (
    <View>
      <Text style={{ fontSize: 18 }}>Balance: {total.toFixed(2)}</Text>
      <Text style={{ marginTop: 12, fontWeight: '600' }}>Budgets</Text>
      <FlatList data={budgets} keyExtractor={b => b.id} renderItem={({item}) => <Text>{item.name}: {item.limit}</Text>} />
      <Text style={{ marginTop: 12, fontWeight: '600' }}>Recent Transactions</Text>
      <FlatList data={transactions.slice(-10).reverse()} keyExtractor={t=>t.id} renderItem={({item}) => <Text>{item.date} - {item.name} - {item.amount}</Text>} />
      {forecast && <Text style={{ marginTop: 12 }}>Avg monthly: {forecast.avgMonthly.toFixed(2)}</Text>}
    </View>
  );
}
