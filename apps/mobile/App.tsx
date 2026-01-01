import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import PlaidLinkScreen from './PlaidLinkScreen';
import Dashboard from './Dashboard';

export default function App() {
  const [name, setName] = useState('');
  const [screen, setScreen] = useState<'profile'|'plaid'|'dashboard'>('profile');
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    // placeholder for loading profile from API
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <Button title="Profile" onPress={() => setScreen('profile')} />
        <Button title="Plaid" onPress={() => setScreen('plaid')} />
        <Button title="Dashboard" onPress={() => setScreen('dashboard')} />
      </View>

      {screen === 'profile' && (
        <ScrollView>
          <Text style={{ fontSize: 22, marginBottom: 12 }}>Profile (Mobile Demo)</Text>
          <View>
            <Text>Name</Text>
            <TextInput value={name} onChangeText={(t) => { setName(t); setUnsaved(true); }} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
          </View>
          <View style={{ marginTop: 12 }}>
            <Button title={unsaved ? 'Save' : 'Saved'} onPress={() => setUnsaved(false)} />
          </View>
        </ScrollView>
      )}

      {screen === 'plaid' && <PlaidLinkScreen />}
      {screen === 'dashboard' && <Dashboard />}
    </SafeAreaView>
  );
}
