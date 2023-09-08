import { InjectionToken } from '@angular/core';

import { ConfigurationInterface } from '../interfaces/configuration.interface';

export const ENVIRONMENT_CONFIG_TOKEN = new InjectionToken<ConfigurationInterface>('EnvironmentConfigToken');
