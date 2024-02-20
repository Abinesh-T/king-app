import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kingwizard.kingtrans',
  appName: 'KingTrans',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
