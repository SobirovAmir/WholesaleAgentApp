import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type UserProfile = {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  soldProducts?: number;
  storeVisits?: number;
};

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<RouteProp<any, any>>();
  const { user, serverUrl } = route.params || {};
  const fetchProfile = async () => {
    if (!user?.id || !serverUrl) {
      setError("Недостаточно данных для загрузки профиля");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = serverUrl.replace(/\/+$/, "");
      const apiUrl = `${baseUrl}/users/${user.id}`;
      console.log("Fetching profile from:", apiUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Профиль не найден на сервере");
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data: UserProfile = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      let errorMessage = "Ошибка при загрузке профиля";
      if (error.name === "AbortError") {
        errorMessage = "Таймаут запроса. Проверьте подключение";
      } else if (error.message.includes("404")) {
        errorMessage = "Профиль не найден на сервере";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);

      // Используем переданные данные как fallback
      if (user) {
        setProfile({
          id: user.id,
          username: user.username,
          role: user.role,
          firstName: user.firstName || "Не указано",
          lastName: user.lastName || "Не указано",
          phone: user.phone,
          email: user.email,
          soldProducts: user.soldProducts,
          storeVisits: user.storeVisits,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, serverUrl]);

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const handleRetry = () => {
    if (!isLoading) {
      fetchProfile();
    }
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Профиль агента</Text>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Повторить попытку"
            onPress={handleRetry}
            color="#2e86de"
          />
        </View>
      )}

      {profile ? (
        <View style={styles.profileCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Личные данные</Text>
            <ProfileRow
              label="ФИО"
              value={`${profile.firstName} ${profile.lastName}`}
            />
            <ProfileRow label="Логин" value={profile.username} />
            <ProfileRow label="Роль" value={profile.role} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Контакты</Text>
            <ProfileRow label="Телефон" value={profile.phone || "Не указан"} />
            <ProfileRow label="Email" value={profile.email || "Не указан"} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Статистика</Text>
            <ProfileRow
              label="Продано товаров"
              value={profile.soldProducts?.toString() || "0"}
            />
            <ProfileRow
              label="Посещения магазинов"
              value={profile.storeVisits?.toString() || "0"}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>Данные профиля недоступны</Text>
      )}

      <View style={styles.actions}>
        <Button
          title="Обновить данные"
          onPress={handleRetry}
          disabled={isLoading}
          color="#2e86de"
        />
        <Button title="Выйти" onPress={handleLogout} color="#ee5253" />
      </View>

      {isLoading && (
        <ActivityIndicator
          style={styles.loading}
          size="small"
          color="#2e86de"
        />
      )}
    </ScrollView>
  );
};

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f6fa",
    marginTop: 35,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  loadingText: {
    marginTop: 12,
    color: "#576574",
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222f3e",
    marginBottom: 24,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#c0392b",
    marginBottom: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e86de",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 6,
  },
  label: {
    fontWeight: "500",
    color: "#576574",
    fontSize: 16,
  },
  value: {
    color: "#222f3e",
    fontSize: 16,
  },
  noDataText: {
    color: "#8395a7",
    textAlign: "center",
    marginVertical: 32,
    fontSize: 16,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  loading: {
    marginTop: 16,
  },
});

export default ProfileScreen;
