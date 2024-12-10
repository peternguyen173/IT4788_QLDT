import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../navigators/AuthProvider';

const MainLayout = ({ title, children, navigation, showBackButton = false }) => {
    const { userData, unreadCount, markInboxAsRead } = useAuth();

    const handleInboxPress = () => {
        markInboxAsRead(); // Mark inbox as read
        navigation.navigate('ChatScreen');
    };

    const handleNotificationPress = () => {
        navigation.navigate('Notifications');
    }

    const handleBack = () => {
        navigation.goBack(); // Quay lại màn hình trước đó
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title={title} onBack={showBackButton ? handleBack : null} />
            <View style={styles.content}>{children}</View>
            <Footer
                onHomePress={() =>
                    navigation.navigate(userData.role === 'LECTURER' ? 'TeacherHome' : 'StudentHome')
                }
                onProfilePress={() =>
                    navigation.navigate(userData.role === 'LECTURER' ? 'TeacherProfile' : 'StudentProfile')
                }
                onInboxPress={handleInboxPress}
                unreadCount={unreadCount}
                onNotificationPress={handleNotificationPress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});

export default MainLayout;
