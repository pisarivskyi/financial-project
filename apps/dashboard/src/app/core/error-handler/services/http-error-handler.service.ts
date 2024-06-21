import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService extends ErrorHandler {
  notificationService = inject(NzNotificationService);

  override handleError(error: HttpErrorResponse): void {
    this.notificationService.error('Network error', error.message);
  }
}
