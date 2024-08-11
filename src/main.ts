import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as process from 'process';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  (window as any).process = process;