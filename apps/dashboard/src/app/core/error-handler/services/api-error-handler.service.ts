import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorHandlerService extends ErrorHandler {
  notificationService = inject(NzNotificationService);

  override handleError(errorResponse: HttpErrorResponse): void {
    const { error } = errorResponse as {
      error: { error: string; message: { field: string; errors: Record<string, string> }[] };
    };

    this.notificationService.error('Response handling error', error.error);
  }
}
