import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet,ImageBackground} from 'react-native';
import Registration from './components/auth/Registration';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Verification from './components/auth/Verification';

const image = { uri: "https://png.yourpng.com/uploads/preview/bird-vijay-mahar-cb-background-11592913381pahovbo22p.jpg" };

class HomeScreen extends React.Component {
   render() {
       return (
        <ImageBackground source={image} style={styles.image}>
           <View style={[styles.titleText,{ flex: 1, alignItems: "center", justifyContent: "center",fontWeight: 'bold'}]}>
             
               <Text style= {{fontSize: 30, color: "#FFF", marginBottom: 50, textAlign: "center", fontFamily: 'Karantina Cursive', fontFamily: 'Original Surfer Cursive'}}>Register and Check Birds</Text>
               
               <TouchableHighlight style={[styles.buttonContainer, styles.button]} activeOpacity={1} underlayColor="#6F8107" onPress={() => this.props.navigation.navigate('Registration')}>
                    <Text style={styles.buttonText}>Registration</Text>
                  
               </TouchableHighlight>

               <TouchableHighlight style={[styles.buttonContainer, styles.button]} activeOpacity={1} underlayColor="#6F8107" onPress={() => this.props.navigation.navigate('Verification')}>
                   <Text style={styles.buttonText}>Verification</Text>
               </TouchableHighlight>
              
           </View>
           </ImageBackground>
       );
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

export default class App extends Component {
   render() {
       return <AppContainer />;
   }
}

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

    titleText: {
      backgroundColor: "rgba(0,0,0,0.3)",
      padding:15
    },

    button: {
      backgroundColor: 'rgba(186,215,12,1)',
      width: 200,
      marginTop: 5,
      shadowColor:"gray"
    },
   
    buttonText: {
       color: 'white',
       fontWeight: 'bold',
    },
})
