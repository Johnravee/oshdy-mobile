// app.config.ts
import 'dotenv/config'; // optional if you still want to support .env
import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'oshdy',
  slug: 'oshdy',
  version: '1.0.0',
  sdkVersion: '52.0.0',
  extra: {
    supabaseUrl: 'https://ezzpttxajkfwdgxsslsb.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6enB0dHhhamtmd2RneHNzbHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTUwNTUsImV4cCI6MjA1ODI3MTA1NX0.kozAOx5JUe03pMAjfXY5KYhYmVXbh4LKyTeYMsONUYs',
  },
};

export default config;
