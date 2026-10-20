# Native tabs reorder reproduction

Minimal bare React Native reproduction for [react-native-screens #4983](https://github.com/software-mansion/react-native-screens/issues/4983).

## Environment

- React Native 0.88.0 / React 19.3.0 (Fabric, Hermes)
- react-native-screens 4.30.0, **unpatched**
- @react-navigation/native 7.5.1
- @react-navigation/bottom-tabs 7.21.0 (`createNativeBottomTabNavigator` from `/unstable`)
- Target: iOS 27.1, iPhone Duo Simulator

Uses the official React Native 0.88.0 native template, including its `SceneDelegate` lifecycle for Xcode 27 / iOS 27.

## Run

Requires Node >= 22.11, Xcode and CocoaPods.

```sh
npm install
cd ios && pod install && cd ..
npm start
```

In a second terminal:

```sh
npm run ios -- --simulator "iPhone Duo"
```

Uses the default Metro port 8081. Stop another project’s Metro server before starting this demo.

## Reproduce

1. Launch the app. D is initially selected; the native bar shows A, B, C, D.
2. Press **Swap A and B**, without tapping a native tab.
3. The **JS order** label changes to B, A, C, D. Expected: the native bar changes immediately too. Observed on iOS 27.1: it retains A, B, C, D until a tab is tapped.
4. **Hide C / Show C** changes membership rather than just order, and is the control case that updates the native bar immediately.

Screen keys, screen component identity and the navigator stay stable when swapping. There is no drag library, persistence, application store, navigator remount or workaround patch.

Verified with Xcode 27.1 on the iPhone Duo Simulator: reorder remains stale until a tab is tapped; hide/show updates immediately. TypeScript, ESLint and the iOS Debug build pass.

The reproduction UI is entirely in `App.tsx`. The generated Android project is included, but this report targets iOS.
