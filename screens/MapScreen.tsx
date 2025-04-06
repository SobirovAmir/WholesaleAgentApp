import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, ActivityIndicator, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

type Store = {
  id: string; // Изменим на string для более надежной работы
  name: string;
  latitude: number;
  longitude: number;
};

const initialStores: Store[] = [
  
];

const MapScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Начинаем с загрузки
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Начальная позиция на карте (Москва)
  const initialRegion = {
    latitude: 39.6480, 
    longitude: 66.9597, 
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Разрешение на доступ к геолокации не предоставлено');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Центрируем карту на пользователе
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка получения местоположения:', error);
      Alert.alert('Ошибка', 'Не удалось получить местоположение');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleShowRoute = () => {
    if (stores.length === 0) {
      Alert.alert('Информация', 'Нет магазинов для построения маршрута');
      return;
    }

    setIsLoading(true);
    const route = stores.map((store) => ({
      latitude: store.latitude,
      longitude: store.longitude,
    }));
    setRouteCoordinates(route);
    setIsLoading(false);
  };

  const focusOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      Alert.alert('Информация', 'Местоположение пользователя не определено');
    }
  };

  const handleMapPress = (e: any) => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation(coordinate);
    setModalVisible(true);
  };

  const addNewStore = () => {
    if (!newStoreName.trim() || !selectedLocation) {
      Alert.alert('Ошибка', 'Введите название магазина');
      return;
    }

    const newStore: Store = {
      id: Date.now().toString(), // Используем timestamp как ID
      name: newStoreName,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    setStores([...stores, newStore]);
    setNewStoreName('');
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Загрузка карты...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container }>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        userLocationPriority="high"
        onPress={handleMapPress}
        showsCompass={true}
        showsBuildings={true}
        showsTraffic={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor="#2e86de"
        loadingBackgroundColor="#f5f6fa"
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            title={store.name}
            description={`Магазин ${store.name}`}
            pinColor="#2e86de" // Синий цвет маркера
          />
        ))}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000"
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={focusOnUserLocation}
          disabled={!userLocation}
        >
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleShowRoute}
          disabled={stores.length === 0}
        >
          <Ionicons name="map" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить новый магазин</Text>
            <TextInput
              style={styles.input}
              placeholder="Название магазина"
              value={newStoreName}
              onChangeText={setNewStoreName}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setModalVisible(false)} color="#ff4757" />
              <Button title="Добавить" onPress={addNewStore} color="#2e86de" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222f3e',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#222f3e',
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: '#2e86de',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#222f3e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: '#222f3e',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MapScreen;