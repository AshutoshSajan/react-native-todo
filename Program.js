/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.logo}>Program</Text>
        <Text style={style.title}>social medeia app for Programmers</Text>
      </View>
      <StoryContainer />
      <PostContainer />
      <Hero />
      <Footer />
    </View>
  );
};

function PostContainer() {
  return (
    <View style={style.postContainer}>
      <Text>
        Today i learned about dark mode and tried to impliment it as well. Today
        i learned about dark mode and tried to impliment it as wellToday i
        learned about dark mode and tried to impliment it as well. Today i
        learned about dark mode and tried to impliment it as well.
      </Text>
      <PostFooter />
    </View>
  );
}

class PostFooter extends React.Component {
  state = {
    // like: false,
    // comment: false,
    // share: false,
    favourite: false,
  };

  handleOnPress = e => {
    console.log(e.target);
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    let { clicked } = this.state;
    return (
      <View style={style.postFooter}>
        <Text style={clicked ? style.capitalText : null }
          onPress={this.handleOnPress}>like : 👍</Text>
        <Text style={clicked ? style.capitalText : null }
          onPress={this.handleOnPress}>comment: 📥</Text>
        <Text style={clicked ? style.capitalText : null }
          onPress={this.handleOnPress}>share: 😎</Text>
        <Text style={clicked ? style.capitalText : null }
          onPress={this.handleOnPress}>
          favourite: 💟
        </Text>
      </View>
    );
  }
}

function StoryContainer() {
  return (
    <View style={style.storyContainer}>
      <Text style={style.storyItem}>Program</Text>
      <Text style={style.storyItem}>Program</Text>
      <Text style={style.storyItem}>Program</Text>
      <Text style={style.storyItem}>Program</Text>
      <Text style={style.storyItem}>Program</Text>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: '#111',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 20,
  },
  logo: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 40,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#333',
    textTransform: 'uppercase',
    padding: 30,
  },
  footerText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'normal',
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    // transform: 'rotate(20deg)',
  },
  container: {
    // height: 100,
    // display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // width: 100,
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: 'green',
  },
  heroText: {
    color: 'blue',
    fontSize: 30,
    textAlign: 'center',
  },
  storyContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyItem: {
    height: 60,
    width: 60,
    color: 'green',
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'red',
    borderRadius: 40,
  },
  postContainer: {
    backgroundColor: '#999',
    padding: 20,
  },
  postFooter: {
    paddingTop: 20,
    paddingBottom: 10,
    // padding: '20 20 20 20',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capitalText: {
    textTransform: 'uppercase',
  },
});

export default App;

function Footer(param) {
  return (
    <View style={style.footer}>
      <Text style={style.footerText}>Footer</Text>
    </View>
  );
}

function Hero(param) {
  return (
    <View style={style.hero}>
      <Text style={style.heroText}>Hero</Text>
    </View>
  );
}
