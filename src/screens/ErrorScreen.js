import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

const ErrorDialog = ({ visible, onClose, title, message }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title || "Error"}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const ErrorScreen = ({ navigation }) => {
  const [errorVisible, setErrorVisible] = useState(false);

  const showError = () => {
    setErrorVisible(true);
  };

  const hideError = () => {
    setErrorVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ErrorDialog
        visible={true}
        onClose={hideError}
        title="Oops!"
        message="Something went wrong. Please try again later."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d32f2f",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ErrorScreen;
=======
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>{title || "Error"}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
const ErrorScreen = ({ navigation }) => {
    const [errorVisible, setErrorVisible] = useState(false);

    const showError = () => {
        setErrorVisible(true);
    };

    const hideError = () => {
        setErrorVisible(false);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ErrorDialog
                visible={true}
                onClose={hideError}
                title="Oops!"
                message="Something went wrong. Please try again later."
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    dialog: {
        width: Dimensions.get("window").width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#d32f2f",
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    button: {
        backgroundColor: "#d32f2f",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ErrorScreen;
