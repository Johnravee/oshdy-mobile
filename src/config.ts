// src/config.ts
import Constants from 'expo-constants';

type AppConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const config = Constants.expoConfig?.extra as AppConfig;

export default config;
