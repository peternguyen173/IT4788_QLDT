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
=======
const UpcomingRoute = ({ surveys }) => {
    const navigation = useNavigation();
    // Group surveys by month and format for SectionList
    const groupedSurveys = surveys.reduce((acc, survey) => {
        const date = new Date(survey.deadline);
        const sectionTitle = `Ngày ${date.getDate()} tháng ${date.getMonth() + 1 } năm ${date.getFullYear()}`;
        
        const existingSection = acc.find(section => section.title === sectionTitle);
        
        if (existingSection) {
            existingSection.data.push({
                id: survey.id.toString(),
                name: survey.title,
                sendTime: new Date(survey.deadline).toLocaleTimeString([], { year:'2-digit',hour: '2-digit', minute: '2-digit' }),
                description: survey.description,
                fileUrl: survey.file_url
            });
        } else {
            acc.push({
                title: sectionTitle,
                data: [{
                    id: survey.id.toString(),
                    name: survey.title,
                    sendTime: new Date(survey.deadline).toLocaleTimeString([], { year:'2-digit',hour: '2-digit', minute: '2-digit' }),
                    description: survey.description,
                    fileUrl: survey.file_url
                }]
            });
        }
        
        return acc;
    }, []);

    // Sort sections by date (most recent first)
    const sortedSections = groupedSurveys.sort((a, b) => {
        const dateA = a.data[0].sendTime;
        const dateB = b.data[0].sendTime;
        return new Date(dateB) - new Date(dateA);
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer}
            onPress={()=>navigation.navigate('SubmitExam', {survey: item})}
        >
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>Deadline {item.sendTime}</Text>
            {item.description && (
                <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            )}
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
                sections={sortedSections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={true}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No assignments found</Text>
                    </View>
                }
            />
        </View>
    );
};

const Assignments = ({ navigation, route }) => {
    const { userData } = useAuth();
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [upcomingSurveys, setUpcomingSurveys] = useState([]);
    const [completedSurveys, setCompletedSurveys] = useState([]);
    const [overdueSurveys, setOverdueSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAssignmentsByType = async (type) => {
        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/get_student_assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    type: type,
                    class_id: route.params.classId || null
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                return data.data || [];
            } else {
                console.log(`Error fetching ${type} assignments`);
                return [];
            }
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const fetchAllAssignments = async () => {
        try {
            setLoading(true);
            const upcoming = await getAssignmentsByType('UPCOMING');
            const completed = await getAssignmentsByType('COMPLETED');
            const overdue = await getAssignmentsByType('PASS_DUE');

            setUpcomingSurveys(upcoming);
            setCompletedSurveys(completed);
            setOverdueSurveys(overdue);
            setLoading(false);
        } catch (err) {
            setError("Network error");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllAssignments();
    }, [route.params.classId]);

    const renderScene = SceneMap({
        upcoming: () => <UpcomingRoute surveys={upcomingSurveys} />,
        completed: () => <UpcomingRoute surveys={completedSurveys} />,
        overdue: () => <UpcomingRoute surveys={overdueSurveys} />,
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
};

const styles = StyleSheet.create({
    // ... (styles remain the same as in the previous version)
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
    itemDescription: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});

export default Assignments;
