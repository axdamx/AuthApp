import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../hooks/useUsers";
import COLORS from "../components/colors";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const { users: storedUsers, loading, error } = useUsers();
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Initialize localUsers from AsyncStorage (or storedUsers)
  useEffect(() => {
    setLocalUsers(storedUsers);
  }, [storedUsers]);

  // Remove user function
  const removeUser = async (id: string) => {
    const updatedUsers = localUsers.filter((u) => u.id !== id);
    setLocalUsers(updatedUsers);
    try {
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (err) {
      console.error("Failed to update users in AsyncStorage:", err);
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert("Confirm Logout", `Are you sure you want to logout?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => logout(),
        },
      ]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => {
    const isCurrentUser = item.id === user?.id;

    return (
      <View
        style={[styles.userItem, isCurrentUser && styles.userItemCurrentUser]}
      >
        {isCurrentUser ? (
          <TouchableOpacity style={styles.ownerButton}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={(e) => {
              Alert.alert(
                "Confirm Delete",
                `Are you sure you want to remove ${item.name}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => removeUser(item.id),
                  },
                ]
              );
            }}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setSelectedUser(item);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!user) return null;
  if (loading) return <ActivityIndicator size="large" color={COLORS.blue} />;
  if (error) return <Text style={{ color: COLORS.red }}>{error}</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.emailLabel}>Email:</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.usersSection}>
        <Text style={styles.sectionTitle}>All Users</Text>
        <FlatList
          data={localUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No users found</Text>
          )}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            <View>
              <View style={styles.modalInfo}>
                <Text style={styles.modalLabel}>Name:</Text>
                <Text style={styles.modalValue}>{selectedUser?.name}</Text>
              </View>
              <View style={styles.modalInfo}>
                <Text style={styles.modalLabel}>Email:</Text>
                <Text style={styles.modalValue}>{selectedUser?.email}</Text>
              </View>
              <View style={styles.modalInfo}>
                <Text style={styles.modalLabel}>Password:</Text>
                <Text style={styles.modalValue}>{selectedUser?.password}</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginHorizontal: 20,
  },
  userItemCurrentUser: {
    borderWidth: 2,
    borderColor: COLORS.blue,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    width: "95%",
    maxWidth: 400,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: COLORS.black,
  },
  modalInfo: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.grey,
  },
  modalValue: {
    fontSize: 16,
    color: COLORS.black,
  },
  closeButton: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.black,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  emailLabel: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  usersSection: {
    width: "100%",
    flex: 1,
    marginBottom: 120, // Space for logout button
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 5,
  },
  emptyListText: {
    textAlign: "center",
    color: COLORS.black,
    padding: 20,
  },
  removeButton: {
    position: "absolute",
    marginRight: 6,
    marginTop: 6,
    top: 5,
    right: 5,
    backgroundColor: COLORS.red,
    width: 25,
    height: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  ownerButton: {
    position: "absolute",
    marginRight: 6,
    marginTop: 6,
    top: 5,
    right: 5,
    backgroundColor: COLORS.blue,
    width: 25,
    height: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  removeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default HomeScreen;
