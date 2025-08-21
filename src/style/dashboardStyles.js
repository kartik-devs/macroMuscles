import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  workoutList: {
    paddingRight: 20,
  },
  workoutCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  workoutOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  playButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: 'rgba(229, 57, 53, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeList: {
    paddingRight: 20,
  },
  challengeCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  calendarContainer: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  calendarPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  // User Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  // Recent Workouts Section
  recentWorkoutItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderBottomWidth: 1,
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentWorkoutDate: {
    fontSize: 12,
  },
  recentWorkoutStats: {
    alignItems: 'flex-end',
  },
  recentWorkoutCalories: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentWorkoutDuration: {
    fontSize: 12,
  },
}); 