import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, TouchableOpacity } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    // placeholder for loading profile from API
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Profile (Mobile Demo)</Text>
      <View>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={(t) => { setName(t); setUnsaved(true); }} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button title={unsaved ? 'Save' : 'Saved'} onPress={() => setUnsaved(false)} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Cat animation and wallpaper are available in the web demo for now.</Text>
      </View>
    </SafeAreaView>
  );
}
