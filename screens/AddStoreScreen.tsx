import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddStoreScreen = () => {
  const [storeName, setStoreName] = useState('');

  const handleSave = () => {
    console.log('Store Added:', storeName);
    // Здесь можно добавить API запрос для сохранения данных
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Store Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter store name"
        value={storeName}
        onChangeText={setStoreName}
      />
      <Button title="Save Store" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default AddStoreScreen;
