import { Platform } from 'react-native';
import { planStorage } from '../storage/planStorage';

/**
 * Mobile Network Presets
 */
export const API_PRESETS = {
  // Production Backend hosted on Render Free tier
  PRODUCTION: 'https://fitshift-1mgj.onrender.com',

  // Android Emulator standard loopback to host machine
  EMULATOR_PORT_5001: 'http://10.0.2.2:5001',
  EMULATOR_PORT_5000: 'http://10.0.2.2:5000',

  // Physical Android Device Local Wi-Fi Demo (Host Machine LAN)
  LAN_DEMO: 'http://10.236.248.137:5001',
  
  // iOS Simulator loopback to localhost
  IOS_SIMULATOR_5001: 'http://localhost:5001',
  IOS_SIMULATOR_5000: 'http://localhost:5000',
} as const;

/**
 * Active Default API Target Configuration
 * 
 * Change this single setting to toggle between Production and Local Development:
 * - 'PRODUCTION': Uses https://fitshift-1mgj.onrender.com (Default for release & production QA)
 * - 'LOCAL': Uses http://10.0.2.2:5001 (Android Emulator loopback)
 * - 'LAN': Uses http://10.236.248.137:5001 (Physical device on local Wi-Fi)
 */
export type ApiTarget = 'PRODUCTION' | 'LOCAL' | 'LAN';
export const ACTIVE_API_TARGET: ApiTarget = 'PRODUCTION';

// Resolves default URL based on target
const resolveTargetUrl = (target: ApiTarget): string => {
  switch (target) {
    case 'LOCAL':
      return Platform.select({
        android: API_PRESETS.EMULATOR_PORT_5001,
        ios: API_PRESETS.IOS_SIMULATOR_5001,
        default: 'http://localhost:5001',
      });
    case 'LAN':
      return API_PRESETS.LAN_DEMO;
    case 'PRODUCTION':
    default:
      return API_PRESETS.PRODUCTION;
  }
};

const DEFAULT_URL = resolveTargetUrl(ACTIVE_API_TARGET);

class ApiConfig {
  private activeBaseUrl: string = DEFAULT_URL;
  private isInitialized: boolean = false;

  async init(): Promise<string> {
    if (this.isInitialized) return this.activeBaseUrl;
    const customUrl = await planStorage.loadCustomApiUrl();

    // When configured for PRODUCTION, ensure production URL is active by default.
    // Cleanly migrate any legacy localhost, emulator loopback, or placeholder URLs stored in AsyncStorage.
    if (ACTIVE_API_TARGET === 'PRODUCTION') {
      if (
        !customUrl ||
        customUrl.includes('10.0.2.2') ||
        customUrl.includes('localhost') ||
        customUrl.includes('127.0.0.1') ||
        customUrl.includes('10.236.') ||
        customUrl.includes('api.fitshift.app')
      ) {
        this.activeBaseUrl = API_PRESETS.PRODUCTION;
        await planStorage.saveCustomApiUrl(API_PRESETS.PRODUCTION);
      } else {
        this.activeBaseUrl = customUrl.trim().replace(/\/$/, '');
      }
    } else {
      if (customUrl && customUrl.trim().length > 0) {
        this.activeBaseUrl = customUrl.trim().replace(/\/$/, '');
      } else {
        this.activeBaseUrl = DEFAULT_URL;
      }
    }

    this.isInitialized = true;
    return this.activeBaseUrl;
  }

  getBaseUrl(): string {
    return this.activeBaseUrl;
  }

  async setBaseUrl(newUrl: string): Promise<void> {
    this.activeBaseUrl = newUrl.trim().replace(/\/$/, '');
    await planStorage.saveCustomApiUrl(this.activeBaseUrl);
  }

  async resetToDefault(): Promise<void> {
    this.activeBaseUrl = DEFAULT_URL;
    await planStorage.saveCustomApiUrl(DEFAULT_URL);
  }

  isProduction(): boolean {
    return this.activeBaseUrl === API_PRESETS.PRODUCTION || this.activeBaseUrl.includes('onrender.com');
  }

  getAvailablePresets(): Array<{ label: string; url: string }> {
    return [
      { label: 'Production Backend (Render)', url: API_PRESETS.PRODUCTION },
      { label: 'Android Emulator (Port 5001)', url: API_PRESETS.EMULATOR_PORT_5001 },
      { label: 'Android Emulator (Port 5000)', url: API_PRESETS.EMULATOR_PORT_5000 },
      { label: 'Physical Phone Wi-Fi LAN (Port 5001)', url: API_PRESETS.LAN_DEMO },
      { label: 'iOS Simulator (Port 5001)', url: API_PRESETS.IOS_SIMULATOR_5001 },
    ];
  }
}

export const apiConfig = new ApiConfig();
export default apiConfig;
