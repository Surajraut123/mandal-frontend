import { Font, StyleSheet } from '@react-pdf/renderer';
import NotoSansDevanagari from '../assets/NotoSansDevanagari-Regular.ttf';

Font.register({
    family: 'NotoSansDevanagari',
    src: NotoSansDevanagari
})
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    padding: 30,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  image: {
    width: '100px',
    height: '100px',
  },
  title :{
    color: "red",
    fontFamily: 'NotoSansDevanagari',
    fontSize: 20
  },
  mantra: {
    color: "black",
    fontFamily: 'NotoSansDevanagari',
    fontSize: 8,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  titleHeading: {
    flexDirection:'column'
  },
  content: {
    flexDirection:'column',
    paddingLeft:30
  },
  userDetails: {
    flexDirection:'column',
    paddingLeft:30
  },
  contentList: {
    fontFamily: 'NotoSansDevanagari',

  }
});
