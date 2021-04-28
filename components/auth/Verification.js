import React, {Component} from 'react';
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

class Verification extends Component {
    constructor(props){
       super(props);
       this.state =  {
           username: '',
           capturedImage : ''
       };
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

   verification = () => {
       if(this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
           alert("Please Capture the Image");
       } else {
           const apiName = "<api-name>";
           const path = "<your path>";
          
           const init = {
               headers : {
                   'Accept': 'application/json',
                   "X-Amz-Target": "RekognitionService.SearchFacesByImage",
                   "Content-Type": "application/x-amz-json-1.1"
               },
               body : JSON.stringify({
                   Image: this.state.base64String,
                   name: this.state.username
               })
           }
          
           API.post(apiName, path, init).then(response => {
               if(JSON.stringify(response.FaceMatches.length) > 0) {
                   alert(response.FaceMatches[0].Face.ExternalImageId)
               } else {
                   alert("No matches found.")
               }
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
                   <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15, marginTop: 10 }}>Verify Face</Text>
              
                   {this.state.capturedImage !== "" && <View style={styles.imageholder} >
                       <Image source={{uri : this.state.capturedImage}} style={styles.previewImage} />
                   </View>}
                    <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                        <Text style={styles.buttonText}>Capture Image</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.verifyButton]} onPress={this.verification}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableHighlight>
               </ScrollView>
           </View>
       );
   }
}

const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
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
    verifyButton: {
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

export default Verification;