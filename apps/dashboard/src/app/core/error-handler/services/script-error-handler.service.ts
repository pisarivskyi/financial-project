import { ErrorHandler, Injectable, inject } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class ScriptErrorHandlerService extends ErrorHandler {
  notificationService = inject(NzNotificationService);

  override handleError(error: Error): void {
    this.notificationService.error('Application error', error.message);
  }
}
