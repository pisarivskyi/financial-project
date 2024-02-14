import { bootstrapApplication } from '@angular/platform-browser';
import 'reflect-metadata';

// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from '../../../package.json';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// eslint-disable-next-line no-console
console.log(`Dashboard: v${packageJson.version}`);

// eslint-disable-next-line no-console
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
