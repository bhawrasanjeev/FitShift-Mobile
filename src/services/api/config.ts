import { Platform } from 'react-native';
import { planStorage } from '../storage/planStorage';

/**
 * Mobile Network Presets
 */
export const API_PRESETS = {
  // Android Emulator standard loopback to host machine
  EMULATOR_PORT_5000: 'http://10.0.2.2:5000',
  EMULATOR_PORT_5001: 'http://10.0.2.2:5001',
  
  // iOS Simulator loopback to localhost
  IOS_SIMULATOR_5000: 'http://localhost:5000',
  IOS_SIMULATOR_5001: 'http://localhost:5001',

  // Production endpoint placeholder
  PRODUCTION: 'https://api.fitshift.app',
} as const;

// Default endpoint based on platform
const DEFAULT_URL = Platform.select({
  android: API_PRESETS.EMULATOR_PORT_5001,
  ios: API_PRESETS.IOS_SIMULATOR_5001,
  default: 'http://localhost:5001',
});

class ApiConfig {
  private activeBaseUrl: string = DEFAULT_URL;
  private isInitialized: boolean = false;

  async init(): Promise<string> {
    if (this.isInitialized) return this.activeBaseUrl;
    const customUrl = await planStorage.loadCustomApiUrl();
    if (customUrl && customUrl.trim().length > 0) {
      this.activeBaseUrl = customUrl.trim().replace(/\/$/, '');
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

  getAvailablePresets(): Array<{ label: string; url: string }> {
    return [
      { label: 'Android Emulator (Port 5000)', url: API_PRESETS.EMULATOR_PORT_5000 },
      { label: 'Android Emulator (Port 5001 - macOS AirPlay)', url: API_PRESETS.EMULATOR_PORT_5001 },
      { label: 'iOS Simulator (Port 5000)', url: API_PRESETS.IOS_SIMULATOR_5000 },
      { label: 'iOS Simulator (Port 5001)', url: API_PRESETS.IOS_SIMULATOR_5001 },
      { label: 'Production Backend', url: API_PRESETS.PRODUCTION },
    ];
  }
}

export const apiConfig = new ApiConfig();
export default apiConfig;
