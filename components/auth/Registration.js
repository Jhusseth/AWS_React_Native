import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native';
import ImagePicker from "react-native-image-picker";
import Amplify, {API} from "aws-amplify";
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
            <View style={styles.MainContainer}>
                <ScrollView>
                    <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15, marginTop: 10 }}>Register Face</Text>
                
                    <TextInput
                        placeholder="Enter Username"
                        onChangeText={UserName => this.setState({username: UserName})}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />


                    {this.state.capturedImage !== "" && <View style={styles.imageholder} >
                        <Image source={{uri : this.state.capturedImage}} style={styles.previewImage} />
                    </View>}

                    <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                        <Text style={styles.buttonText}>Capture Image</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.submitButton]} onPress={this.submitButtonHandler}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    TextInputStyleClass: {
      textAlign: 'center',
      marginBottom: 7,
      height: 40,
      borderWidth: 1,
      margin: 10,
      borderColor: '#D0D0D0',
      borderRadius: 5 ,
    },
    inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:300,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
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
      backgroundColor: "#337ab7",
      width: 350,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    // horizontal: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-around',
    //   padding: 10
    // },
    submitButton: {
      backgroundColor: "#C0C0C0",
      width: 350,
      marginTop: 5,
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