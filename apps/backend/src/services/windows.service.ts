import { config } from '../config/index.js';
import { retry } from '@prosite/shared';
import type { CastleSettings } from '@prosite/shared';
import crypto from 'crypto';

class WindowsService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = config.windowsServiceUrl;
    this.apiKey = config.windowsServiceApiKey;
  }

  private generateHmac(payload: string): string {
    return crypto
      .createHmac('sha256', this.apiKey)
      .update(payload)
      .digest('hex');
  }

  async updateCastle(castleId: string, settings: CastleSettings): Promise<void> {
    const payload = JSON.stringify({ castleId, settings });
    const hmac = this.generateHmac(payload);

    await retry(async () => {
      const response = await fetch(`${this.apiUrl}/windows-api/castles/${castleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HMAC-Signature': hmac,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Windows service error: ${response.statusText}`);
      }
    }, 3, 1000);
  }
}

export const windowsService = new WindowsService();