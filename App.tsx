import React, { createContext, useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabNavigationOptions,
  type NativeBottomTabScreenProps,
} from '@react-navigation/bottom-tabs/unstable';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Tabs = { A: undefined; B: undefined; C: undefined; D: undefined };
type TabName = keyof Tabs;
const initialOrder: TabName[] = ['A', 'B', 'C', 'D'];
const Tab = createNativeBottomTabNavigator<Tabs>();
const icons: Record<TabName, NativeBottomTabNavigationOptions['tabBarIcon']> = {
  A: { type: 'sfSymbol', name: 'a.circle' },
  B: { type: 'sfSymbol', name: 'b.circle' },
  C: { type: 'sfSymbol', name: 'c.circle' },
  D: { type: 'sfSymbol', name: 'd.circle' },
};

type Controls = {
  visibleOrder: TabName[];
  showC: boolean;
  swap: () => void;
  toggleC: () => void;
};
const ControlsContext = createContext<Controls | null>(null);

// A single, stable component is used for all screens throughout the reproduction.
function DemoScreen({ route }: NativeBottomTabScreenProps<Tabs>) {
  const controls = useContext(ControlsContext)!;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Native tabs reorder</Text>
      <Text style={styles.selected}>Selected screen: {route.name}</Text>
      <Text style={styles.order} testID="js-order">
        JS order: {controls.visibleOrder.join(' → ')}
      </Text>
      <View style={styles.button}>
        <Button title="Swap A and B" onPress={controls.swap} />
      </View>
      <View style={styles.button}>
        <Button
          title={controls.showC ? 'Hide C' : 'Show C'}
          onPress={controls.toggleC}
        />
      </View>
      <Text style={styles.instructions}>
        Stay on D and swap A/B. Compare the JS order above with the native tab
        bar before tapping any tab. Hiding/showing C is the control case.
      </Text>
    </SafeAreaView>
  );
}

export default function App() {
  const [order, setOrder] = useState(initialOrder);
  const [showC, setShowC] = useState(true);
  const visibleOrder = order.filter(name => showC || name !== 'C');

  return (
    <SafeAreaProvider>
      <ControlsContext.Provider
        value={{
          visibleOrder,
          showC,
          swap: () => setOrder(([a, b, ...rest]) => [b, a, ...rest]),
          toggleC: () => setShowC(value => !value),
        }}
      >
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="D"
            screenOptions={{ headerShown: false }}
          >
            {visibleOrder.map(name => (
              <Tab.Screen
                key={name}
                name={name}
                component={DemoScreen}
                options={{ tabBarLabel: name, tabBarIcon: icons[name] }}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      </ControlsContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 25, fontWeight: '700', color: '#0f172a' },
  selected: { fontSize: 18, color: '#0f172a' },
  order: { fontSize: 18, fontWeight: '600', color: '#1d4ed8' },
  button: { alignSelf: 'flex-start' },
  instructions: { fontSize: 16, lineHeight: 24, color: '#475569' },
});
