# React Native Authentication App

A React Native application with authentication functionality using React Context API, built with Expo.

## Features

- Login and Signup functionality
- Form validation
- Password visibility toggle
- Persistent authentication using AsyncStorage
- Navigation between screens
- Modern and clean UI design
- Expo SDK integration

## Prerequisites

- Node.js (v18 or higher)
- Expo CLI (recommended) or npm
- Git (optional)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/axdamx/AuthApp.git
```

2. Install dependencies:
```bash
npm install
```

3. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

4. Run the app:
```bash
npm run ios
```

You can also use:
```bash
expo start
```

## Available Commands

- `npm run ios` - Run the app on iOS simulator
- `expo start` - Run the app in development mode

## Project Structure

```
src/
├── context/
│   └── AuthContext.tsx
├── navigation/
│   └── AppNavigator.tsx
└── screens/
    ├── LoginScreen.tsx
    ├── SignupScreen.tsx
    └── HomeScreen.tsx
└── components/
    ├── Input.tsx
    └── colors.ts
└── validation/
    ├── loginSchema.ts
    └── signUpSchema.ts
```

## Tech Stack

- **Expo SDK**: Provides the core infrastructure and development tools for the app
- **React Native**: Framework for building native mobile apps using React
- **React Context API**: Manages authentication state across the app
- **React Navigation**: Handles screen navigation between Login, Signup, and Home screens
- **AsyncStorage**: Stores user authentication data persistently
- **TypeScript**: Provides type safety and better development experience
- **Zod**: Validates form inputs for login and signup
- **React Hook Form**: Manages form state and validation
- **Expo Vector Icons**: Provides icons for UI elements
- **Expo Status Bar**: Controls the status bar appearance
- **Expo Font**: Manages custom fonts in the app

## App Flow

### SignUp Screen (Happy Flow)
https://github.com/user-attachments/assets/306d9fad-be05-4cbb-a77d-12d896351bd0

### User Persisted (Happy Flow)
https://github.com/user-attachments/assets/4da0453b-34b8-48e2-8f6e-6aa4ccbf492a

### Login Screen (Happy Flow)
https://github.com/user-attachments/assets/d8319f1f-f108-420e-b0e8-2eea1ceeca5e

### Login Screen (Bad Flow)
https://github.com/user-attachments/assets/dd812319-130a-4405-9fd4-cc09ebbce1bb

### SignUp Screen (Bad Flow)
https://github.com/user-attachments/assets/988cd93b-5969-45aa-9efe-9cf67269232a



