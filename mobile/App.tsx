import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { setToken } from './src/api';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';

// Only two screens after login, so a simple state value replaces a navigation library.
type Screen = 'home' | 'add';

export default function App() {
  const [token, setTokenState] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('home');

  function handleLogin(newToken: string) {
    setToken(newToken); // for api.ts, so requests send it
    setTokenState(newToken); // for React, so the screen re-renders
    setScreen('home');
  }

  function handleLogout() {
    setToken(null);
    setTokenState(null);
  }

  function goHome() {
    setScreen('home');
  }

  let content;
  if (!token) {
    content = <LoginScreen onLogin={handleLogin} />;
  } else if (screen === 'add') {
    // Going back to 'home' remounts HomeScreen, which reloads the list with the new entry.
    content = <AddEntryScreen onSaved={goHome} onCancel={goHome} />;
  } else {
    content = <HomeScreen onAddPress={() => setScreen('add')} onLogout={handleLogout} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      {content}
    </>
  );
}
