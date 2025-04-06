import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  StatusBar, // Импортируем StatusBar
} from "react-native";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Функция для добавления http:// если он не указан
  const formatServerUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `http://${url}`;
    }
    return url;
  };

  const handleLogin = async () => {
    if (!serverUrl.trim()) {
      Alert.alert("Ошибка", "Введите URL сервера");
      return;
    }

    const formattedUrl = formatServerUrl(serverUrl);
    setServerUrl(formattedUrl); // Обновляем URL с добавлением http://

    console.log(`Пытаемся войти с URL: ${formattedUrl}`);
    console.log(`Логин: ${username}, Пароль: ${password}`);

    setIsLoading(true);
    try {
      const response = await fetch(`${formattedUrl}/users`);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const users = await response.json();

      const user = users.find((u: any) => u.username === username && u.password === password);
      if (!user) {
        Alert.alert("Ошибка", "Неверный логин или пароль");
      } else {
        navigation.replace("Main", { user, serverUrl: formattedUrl });
      }
    } catch (err: any) {
      Alert.alert("Ошибка подключения", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" /> {/* Устанавливаем цвет статус-бара */}

      <Text style={styles.title}>Авторизация</Text>

      <TextInput
        style={styles.input}
        placeholder="URL сервера (например, http://192.168.1.5:3000)"
        value={serverUrl}
        onChangeText={setServerUrl}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Логин"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2c3e50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
