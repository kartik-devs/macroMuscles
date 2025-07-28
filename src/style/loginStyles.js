import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;


export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1e1e',
  },
  topSection: {
    height: hp(36),    // Slightly taller section
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f1e1e',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: wp(8), // 8% of width
    paddingTop: hp(3),
  },
  logo: {
    width: wp(80),       // Change from wp(40) to wp(55) - increases image size
    height: wp(80),      // Keep it square
    resizeMode: 'contain',
    marginBottom: hp(3), // Adjust as needed
    top:hp(2)
  },
  
  title: {
    fontSize: wp(8.5), // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(3),
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: hp(2.5),
    borderRadius: wp(5),
    backgroundColor: '#1a1a1a',
    padding: wp(1),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1.6),
    alignItems: 'center',
    borderRadius: wp(4),
  },
  activeTab: {
    backgroundColor: '#E53935',
  },
  tabText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '500',
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp(2),
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: wp(7),
    padding: wp(4),
    color: '#fff',
    width: '100%',
    borderBottomColor: '#ffffff',
    fontSize: wp(4.2),
    borderWidth: 2,
    marginBottom: hp(2),
    height: hp(7),
  },
  button: {
    backgroundColor: '#E53935',
    borderRadius: wp(7),
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4.8),
    fontWeight: '600',
  },
  errorText: {
    color: '#E53935',
    fontSize: wp(3.6),
    marginTop: hp(-1),
    marginBottom: hp(1.5),
    marginLeft: wp(1),
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: '#E53935',
    fontSize: wp(3.6),
    textAlign: 'center',
    marginBottom: hp(1.3),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),           // Try reducing or adjusting this value to move it up
    marginBottom: hp(2),        // Add if you want a gap from the bottom
  },
  footerText: {
    color: '#fff',
    fontSize: wp(4),
    top:-10
  },
  footerLink: {
    color: '#E53935',
    fontSize: wp(4),
    fontWeight: '600',
    marginLeft: wp(1),
    top:-10
  },
});