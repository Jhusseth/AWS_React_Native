import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight, Platform,ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Amplify,{API,Auth} from 'aws-amplify';

Amplify.configure({
    API: {
      endpoints: [
        {
          name: "API-G1-2021",
          endpoint: "https://w75zpgs6w8.execute-api.us-east-1.amazonaws.com/recognize",
          custom_header: async () => { 
            return {Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`} 
          }
        }
      ]
    }
});

const image = { uri: "https://i.pinimg.com/originals/e5/5f/61/e55f61ca0a88115f64a5398e68005617.jpg" };

class Registration extends React.Component {
    constructor(props){
       super(props);
       this.state =  {
           birdName : '',
           capturedImage : ''
       };
       
    //    this.submitButtonHandler = this.submitButtonHandler.bind(this);
    }



    captureImageButtonHandler = async () => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();

        let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64:true,
        });
    
        if (!result.cancelled) {
            const source={uri: 'data:image/jpeg;base64,' + result.base64}
            this.setState({capturedImage: result.uri, base64String: source.uri});
        }

    }

    submitButtonHandler = async() => {
        if (this.state.birdName == '' || this.state.birdName == undefined || this.state.birdName == null) {
            alert("Please Enter the Birdname");
        } else if(this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
            alert("Please Capture the Image");
        } else {
            const apiName = "API-G1-2021";
            const path = "/upload";
            
            const init = {
                headers : {
                    'Accept': 'application/json',
                    "Content-Type": "application/x-amz-json-1.1",
                    'Content-Encoding': 'gzip',
                    "X-Amz-Target": "RekognitionService.DetectLabels",
                    Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
                },
                body : JSON.stringify({ 
                    Image: this.state.base64String,
                    name: this.state.birdName
                })
            }
            await API.post(apiName,path,init).then(response => {
                alert(JSON.stringify(response))
                console.log(response)
                this.setState({capturedImage : ''})
                this.setState({birdName : ''})
            });

        }
    }
  
    render() {
        if(this.state.image!=="") {
            // alert(this.state.image)
        }
        return (
            <ImageBackground source={image} style={styles.image}>
                <View style={styles.MainContainer}>
                    
                    <ScrollView style={{backgroundColor:"transparent", marginTop:10}}>
                        <Text style= {{ fontSize: 30, color: "#000", textAlign: 'center', marginBottom: 35, marginTop: 10,fontWeight: 'bold' }}>Register Bird</Text>
                    
                        <TextInput
                            placeholder="BirdName"
                            onChangeText={birdName => this.setState({birdName: birdName})}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />


                        {this.state.capturedImage !== "" && <View style={styles.imageholder} >
                            <Image source={{uri : this.state.capturedImage}} style={styles.previewImage} />
                        </View>}

                        <View style={styles.container}>
                            <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                                <Text style={styles.buttonText}>Capture Image</Text>
                            </TouchableHighlight>

                            <TouchableHighlight style={[styles.buttonContainer, styles.submitButton]} onPress={this.submitButtonHandler}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:50
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    TextInputStyleClass: {
        textAlign: 'center',
        marginBottom: 35,
        height: 40,
        borderWidth: 1,
        margin: 10,
        borderColor: '#D0D0D0',
        borderRadius: 5 ,
        backgroundColor:'white',

        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 5,
      marginLeft: 15
    },
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
    captureButton: {
        backgroundColor: "#148ccb",
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: "#C0C0C0",
        width: 200,
        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    imageholder: {
      marginTop:50,
      borderWidth: 1,
      borderColor: "grey",
      backgroundColor: "#eee",
      width: "80%",
      height: 250,
      marginTop: 10,
      marginLeft: 40,
      flexDirection: 'row',
      alignItems:'center',
      shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 5,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    }
});

export default Registration;