import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet,ImageBackground} from 'react-native';
import Registration from './components/screens/Registration';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Verification from './components/screens/Verification';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';


import { withAuthenticator } from 'aws-amplify-react-native';


import Amplify,{Auth} from 'aws-amplify';
import config from './src/aws-exports';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});


let customFonts = {
    'originalSurfer': require('./assets/fonts/OriginalSurfer-Regular.ttf'),
};

const image = { uri: "https://png.yourpng.com/uploads/preview/bird-vijay-mahar-cb-background-11592913381pahovbo22p.jpg" };

class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state =  { 
            fontsLoaded: false, 
        };
    }
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    signOut = async () => {
        try {
          await Auth.signOut({ global: true });
        } catch (error) {
          console.log('error signing out: ', error);
        }
    };


    render() {
        if (this.state.fontsLoaded) {
            return (
                <ImageBackground source={image} style={styles.image}>
                <View style={[styles.bgView,{ flex: 1, alignItems: "center", justifyContent: "center",fontWeight: 'bold'}]}>
                    
                    <Text style= {{fontSize: 30, color: "#FFF", marginBottom: 50, textAlign: "center", fontFamily: 'originalSurfer'}}>Register and Check Birds</Text>
                    
                    <TouchableHighlight style={[styles.buttonContainer, styles.button]} activeOpacity={1} underlayColor="#6F8107" onPress={() => this.props.navigation.navigate('Registration')}>
                            <Text style={styles.buttonText}>Registration</Text>
                        
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.button]} activeOpacity={1} underlayColor="#6F8107" onPress={() => this.props.navigation.navigate('Verification')}>
                        <Text style={styles.buttonText}>Verification</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.button]} activeOpacity={1} underlayColor="#6F8107" onPress={() => signOut()}>
                        <Text style={styles.buttonText}>Salir</Text>
                    </TouchableHighlight>
                    
                </View>
                </ImageBackground>
            );
        }
        else {
            return <AppLoading />;
        }
   }
}

const MainNavigator = createStackNavigator(
   {
       Home: {screen: HomeScreen},
       Registration: {screen: Registration},
       Verification: {screen: Verification}
   },
   {
       initialRouteName: 'Home',
   }
);

const AppContainer = createAppContainer(MainNavigator);

function App() {
    return (
    <AppContainer />
    )
}

// export default class App extends Component {
//    render() {
//        return ;
//    }
// }

export default withAuthenticator(App)

const styles = StyleSheet.create({
    buttonContainer: {
       height:45,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       marginBottom:20,
       width:"80%",
       borderRadius:30,
       marginTop: 20,
       marginLeft: 5,
    },

    image: {
      flex: 1,
      resizeMode: "cover",
    },

    bgView: {
      backgroundColor: "rgba(0,0,0,0.3)",
      padding:15
    },

    button: {
      backgroundColor: 'rgba(186,215,12,1)',
      width: 200,
      marginTop: 5,
      shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 5,
    },
   
    buttonText: {
       color: 'white',
       fontWeight: 'bold',
    },
})
