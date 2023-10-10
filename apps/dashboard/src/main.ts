import { bootstrapApplication } from '@angular/platform-browser';
import 'reflect-metadata';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// eslint-disable-next-line no-console
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
