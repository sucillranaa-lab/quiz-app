# Package Requirements

## Core Dependencies

```json
{
  "expo": "~52.0.0",
  "expo-status-bar": "~2.0.0",
  "react": "18.3.1",
  "react-native": "0.76.9",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/native-stack": "^7.0.0",
  "react-native-screens": "~4.4.0",
  "react-native-safe-area-context": "4.12.0",
  "nativewind": "^4.0.0",
  "tailwindcss": "^3.4.0",
  "idb": "^8.0.0",
  "lucide-react-native": "^0.460.0"
}
```

## Dev Dependencies

```json
{
  "@babel/core": "^7.25.0"
}
```

## Web Dependencies (for web platform)

```json
{
  "react-dom": "18.3.1",
  "react-native-web": "~0.19.13",
  "@expo/metro-runtime": "~4.0.1"
}
```

## Installation Command

```bash
npm install
```

This will install all required packages from package.json.

## System Requirements

- **Node.js**: 18.x or higher (20.x recommended)
- **npm**: 9.x or higher
- **Operating System**: macOS, Windows, or Linux

## For Development

To run the app:

```bash
# Install dependencies
npm install

# Start web development server
npx expo start --web

# Start Android development
npx expo start --android

# Start iOS development
npx expo start --ios
```

## Version Notes

- Expo SDK 52 is used for this project
- React Native 0.76.9 is the compatible version
- React 18.3.1 is the required React version
- NativeWind 4.x requires TailwindCSS 3.x