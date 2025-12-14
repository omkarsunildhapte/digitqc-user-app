import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import LogsScreen from '../screens/LogsScreen';
import SupportScreen from '../screens/SupportScreen';
import CustomDrawerContent from './CustomDrawerContent';
import MainTabs from './MainTabs';
const Drawer = createDrawerNavigator();

export default function MainDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '80%',
                }
            }}
        >
            <Drawer.Screen name="MainTabs" component={MainTabs} />
            <Drawer.Screen name="Logs" component={LogsScreen} />
            <Drawer.Screen name="Support" component={SupportScreen} />
        </Drawer.Navigator>
    );
}