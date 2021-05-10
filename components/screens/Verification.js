import React, {Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Platform, ImageBackground, ActivityIndicator,Alert, Modal,FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {API,Auth} from "aws-amplify";

const image = { uri: "https://i.pinimg.com/originals/e5/5f/61/e55f61ca0a88115f64a5398e68005617.jpg" };


class Verification extends Component {
    constructor(props){
       super(props);
       this.state =  {
           username: 'verification',
           capturedImage : '',
           charge: false,
           modalVisible: false
       };
   }

   setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
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

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64:true,
        });
        
        if (!result.cancelled) {
            const source = { uri: 'data:image/jpeg;base64,' + result.base64 };
            this.setState({capturedImage: result.uri, base64String: source.uri });
        }
    }

    verification = async () => {
        if(this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
           alert("Please Capture the Image");
        } 
        else {

            this.setState({charge:true})

            const apiName = "API-G1-2021";
            const path = "/search";
          
            const init = {
                headers : {
                    'Accept': 'application/json',
                    "X-Amz-Target": "RekognitionService.DetectLabels",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
                },
                body : JSON.stringify({
                    Image: this.state.base64String,
                    name: this.state.username
                })
            }
          try{
            await API.post(apiName,path,init).then(response => {
                this.showData(response.Labels)
                this.setState({charge:false})
           });
        }
        catch(err){
            console.log(err)
            this.setState({charge:false})
        }
       }
    }


    showData = (data)=>{


        var dataBirds = "Datos Encontrados:" + "\n" + "\n" + "\n"

        data.map((item) =>{
            dataBirds += "Tipo: " + item.Name + "\n" + "Precision: " + item.Confidence + "\n"
            dataBirds += "----------------------------------------------------" + "\n"
        })

       alert(dataBirds)
    }
  
  
    render() {
        if(this.state.charge) {
            return (
                <ImageBackground source={image} style={styles.image}>
                    <View style={styles.chargeLading}>
                        <View style={styles.container}>
                            <View style={styles.horizontal}>
                                <ActivityIndicator size="large" color="#001eff" />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            )
        }
        return (
            <ImageBackground source={image} style={styles.image}>
                <View style={styles.MainContainer}>
                    <ScrollView style={{backgroundColor:"transparent", marginTop:60}}>
                        
                        <Text style= {{ fontSize: 30, color: "#000", textAlign: 'center', marginBottom: 35, marginTop: 30,fontWeight: 'bold'}}>Verify Bird</Text>
                
                        {this.state.capturedImage !== "" && <View style={styles.imageholder} >
                        <Image source={{uri : this.state.capturedImage}} style={styles.previewImage} />
                        </View>}
                        <View style={styles.container}>
                            <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                                <Text style={styles.buttonText}>Upload Image</Text>
                            </TouchableHighlight>

                            <TouchableHighlight style={[styles.buttonContainer, styles.verifyButton]} onPress={this.verification}>
                                <Text style={styles.buttonText}>Verify</Text>
                            </TouchableHighlight>
                        </View>
                        
                    </ScrollView>
                    
                </View>
            </ImageBackground>
        );
   }
}

const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding:15
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
    verifyButton: {
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
        width: "80%",
        height: 250,
        marginTop: 10,
        marginLeft: 45,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',

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
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
       
    },
    chargeLading:{
        backgroundColor: "rgba(0,0,0,0.5)",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 5,
    }
});

export default Verification;