import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { openLink } from 'react-native-plaid-link-sdk';

export default function NativePlaid() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  async function getLinkToken() {
    try {
      const res = await fetch('http://localhost:4000/plaid/create_link_token', { method: 'POST' });
      const d = await res.json();
      setLinkToken(d.link_token);
      Alert.alert('Link token ready', 'Token acquired — open Plaid Link to connect an account.');
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  async function openPlaid() {
    if (!linkToken) return Alert.alert('No token', 'Get a link token first');
    try {
      await openLink({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
          await fetch('http://localhost:4000/plaid/exchange_public_token', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ public_token }) });
          Alert.alert('Connected', 'Plaid public token exchanged successfully');
        },
        onExit: (error, metadata) => {
          Alert.alert('Plaid exited', error ? String(error) : 'User exited');
        }
      });
    } catch (err) {
      Alert.alert('Open Link error', String(err));
    }
  }

  return (
    <View>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Plaid (Native)</Text>
      <Button title="Get link token" onPress={getLinkToken} />
      <View style={{ height: 8 }} />
      <Button title="Open Plaid Link (native)" onPress={openPlaid} />
    </View>
  );
}
