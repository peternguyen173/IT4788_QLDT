
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import ItemNotification from '../../components/ItemNotification';


const dataNotifi = [
    {   
        id: 1,
        date: '2021-10-10',
        className: 'Lập trình di động',
        mainContent: 'Bài tập'
    },
    {   
        id: 2,
        date: '2021-10-10',
        className: 'Lập trình di động',
        mainContent: 'Bài tập'
    }
]

const Notifications = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textProps}>List Notification</Text>
            <FlatList styles={styles.containerNotification}
                
                data= {dataNotifi}
                renderItem={
                    ({item}) =>
                        <ItemNotification 
                            date = {item.date} 
                            className={item.className} 
                            mainContent={item.mainContent}/>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        marginTop: 10,
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        
    },

    containerNotification: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
    },
    textProps: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})

export default Notifications;    