import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function PlaidLinkScreen() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  async function getToken() {
    try {
      const res = await fetch('http://localhost:4000/plaid/create_link_token', { method: 'POST' });
      const d = await res.json();
      setLinkToken(d.link_token);
      Alert.alert('Link token acquired', 'Open Plaid Link using the token in a webview or native SDK.');
    } catch (e) { Alert.alert('Error', String(e)); }
  }

  useEffect(() => { /* In a managed Expo app, native Plaid requires prebuild/EAS; we provide token + instruction to open a WebView for dev */ }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Plaid (Mobile Demo)</Text>
      <Button title="Get Link Token" onPress={getToken} />
      <View style={{ height: 12 }} />
      <Button title={connected ? 'Connected' : 'Open Link (WebView)'} onPress={() => Alert.alert('Note', 'For mobile native Plaid, we need to add react-native-plaid-link-sdk and run an EAS build. I can do that next.')} />
    </View>
  );
}
