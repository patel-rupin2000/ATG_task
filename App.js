import 'react-native-gesture-handler';

import React from 'react';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  

  Drawer
  
} from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home';
import { useNetInfo } from '@react-native-community/netinfo';
import { View, Image, StyleSheet, Text } from "react-native";
const Stack = createStackNavigator();



  
  function App(){
    const Drawers = createDrawerNavigator();
    function DrawerContent(props,{ navigation }) {
      return (
        <LinearGradient colors={['#2e2e2e','#3d3d3d','#474747','#545454']} style={styles.linearGradient}>
        <DrawerContentScrollView {...props} >
          <View>
          <View >
     
            <Text style={{color:"white",fontSize:16,alignSelf:'center'}}>GALLERY </Text>
            
      
    
          </View>
    
            <Drawer.Section style={{ marginTop: 15,flexDirection:"column",alignContent:"flex-start",marginLeft:"15%"}}>
              <DrawerItem
                label="Home"
                labelStyle={{color:"white",fontWeight:"bold",fontSize:30}}
                onPress={() => {
                  props.navigation.navigate("Home");
                }}
              />
   
  
            </Drawer.Section>
          </View>
          
   
        </DrawerContentScrollView>
        </LinearGradient>
      
        
      );
    }
    return (
      
      
      <NavigationContainer>
        <Drawers.Navigator drawerContent={props => <DrawerContent {...props} />} backBehavior={false}   >

          <Drawers.Screen name="Home" component={HomeScreen} />
  
 
          
          
          
          
          
          
        </Drawers.Navigator>
      </NavigationContainer>
      
      
    );
  
  }
  var styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
    
      
      
    },
 
  });
export default App;
