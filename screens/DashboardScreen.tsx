import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DashboardScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Screen</Text>
      <Button
        title="Go to Add Store"
        onPress={() => navigation.navigate('AddStore')}
      />
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
  },
});

export default DashboardScreen;
