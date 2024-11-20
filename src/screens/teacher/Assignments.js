import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Text,
  SectionList
} from "react-native";
import { useAuth } from "../../navigators/AuthProvider";
import { SceneMap, TabView } from "react-native-tab-view";

const UpcomingRoute = () => {
  const sections = [
    {
      title: "20 thg 5",
      data: [
        { id: "1", name: "Math Homework", sendTime: "5:00 PM" },
        { id: "2", name: "Science Project", sendTime: "6:00 PM" },
      ],
    },
    {
      title: "12 thg 5",
      data: [
        { id: "3", name: "History Essay", sendTime: "11 thg 5" },
        { id: "4", name: "Physics Quiz", sendTime: "11 thg 5" },
      ],
    },
  ];
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemSubtitle}>Sent at {item.sendTime}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true} 
      />
    </View>
  );
};

const Assignments = ({ navigation }) => {
  const { userData } = useAuth();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const renderScene = SceneMap({
    upcoming: UpcomingRoute,
    completed: UpcomingRoute,
    overdue: UpcomingRoute,
  });

  const routes = [
    { key: "upcoming", title: "Upcoming" },
    { key: "overdue", title: "Overdue" },
    { key: "completed", title: "Completed" },
  ];
  const renderTabBar = (props) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = i === index;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => setIndex(i)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar} //
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerContainer: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    justifyContent: "center",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#6200ea",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Assignments;
