import { Text, View,  StyleSheet } from "react-native"


const ItemNotification = ({date, className, mainContent}) => { 
    console.log(date, className, mainContent)
    return (
        <View style={styles.container}>
            
            <View style={styles.headContent}>
                <Text style={{color:'red'}}>eHust</Text>
                <Text style={{fontWeight:'thin'}}>{date}</Text>
            </View>

            <View style={styles.bodyContent}>
                <Text style={{fontWeight:'bold',fontSize:24}}>{className}</Text>
            </View>

            <View style={styles.divider}/>

            <View style={styles.footContent}>
                <Text>{mainContent}</Text>
            </View>
            <View style={styles.linkContent}>
                <Text>Chi tiết</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    divider: {
        height: 1, // Độ dày của divider
        backgroundColor: '#ccc', // Màu của divider
        marginVertical: 10, // Khoảng cách trên dưới
    },
    headContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bodyContent: {
       marginTop: 10,
       paddingVertical: 10,
    },
})


export default ItemNotification;