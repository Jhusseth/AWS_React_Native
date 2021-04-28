import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight, ImageBackground } from 'react-native';
import ImagePicker from "react-native-image-picker";
import Amplify, {API} from "aws-amplify";

const image = { uri: "https://i.pinimg.com/originals/e5/5f/61/e55f61ca0a88115f64a5398e68005617.jpg" };

Amplify.configure({
   API: {
       endpoints: [
           {
               name: "<API-name>",
               endpoint: "<your endpoint url>"
           }
       ]
   }
});

class Registration extends React.Component {
    constructor(props){
       super(props);
       this.state =  {
           username : '',
           capturedImage : ''
       };
       
    //    this.submitButtonHandler = this.submitButtonHandler.bind(this);
    }

    captureImageButtonHandler = () => {
        ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 600}, (response) => {
            console.log('Response = ', response);
            // alert(response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
            
                this.setState({capturedImage: response.uri, base64String: source.uri });
            }
        });
    }

    submitButtonHandler = () => {
        if (this.state.username == '' || this.state.username == undefined || this.state.username == null) {
            alert("Please Enter the Username");
        } else if(this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
            alert("Please Capture the Image");
        } else {
            const apiName = "<api-name>";
            const path = "<your path>";
            const init = {
                headers : {
                    'Accept': 'application/json',
                    "X-Amz-Target": "RekognitionService.IndexFaces",
                    "Content-Type": "application/x-amz-json-1.1"
                },
                body : JSON.stringify({ 
                    Image: this.state.base64String,
                    name: this.state.username
                })
            }
            
            API.post(apiName, path, init).then(response => {
                alert(response);
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
                    
                    <ScrollView style={{backgroundColor:"transparent", marginTop:60}}>
                        <Text style= {{ fontSize: 30, color: "#000", textAlign: 'center', marginBottom: 35, marginTop: 10,fontWeight: 'bold' }}>Register Bird</Text>
                    
                        <TextInput
                            placeholder="Enter Username"
                            onChangeText={UserName => this.setState({username: UserName})}
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
        marginBottom: 15,
        height: 40,
        borderWidth: 1,
        margin: 10,
        borderColor: '#D0D0D0',
        borderRadius: 5 ,
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
      borderWidth: 1,
      borderColor: "grey",
      backgroundColor: "#eee",
      width: "50%",
      height: 150,
      marginTop: 10,
      marginLeft: 90,
      flexDirection: 'row',
      alignItems:'center'
    },
    previewImage: {
      width: "100%",
      height: "100%",
    }
});

export default Registration;