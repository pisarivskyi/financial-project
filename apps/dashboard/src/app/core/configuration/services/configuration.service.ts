import { Injectable, inject } from '@angular/core';

import { ConfigurationInterface } from '../interfaces/configuration.interface';
import { ENVIRONMENT_CONFIG_TOKEN } from '../tokens/environment-config.token';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private config = inject(ENVIRONMENT_CONFIG_TOKEN);

  getConfiguration(): ConfigurationInterface {
    return this.config;
  }

  getHost(): string {
    return this.getConfiguration().apiHost;
  }
}
