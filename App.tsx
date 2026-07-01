import React, { useEffect } from 'react';
import { TabRoutes, Routes } from './src/pages/routes/routes';
import { NavigationContainer } from '@react-navigation/native';

export default function App(){
  
  return(
    <NavigationContainer>
      {/* <TabRoutes/> */}
      <Routes/>
    </NavigationContainer>
  )
  
}
