import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ApiErrorHandlerService } from './api-error-handler.service';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ScriptErrorHandlerService } from './script-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService extends ErrorHandler {
  constructor(
    private apiErrorHandlerService: ApiErrorHandlerService,
    private httpErrorHandlerService: HttpErrorHandlerService,
    private scriptErrorHandlerService: ScriptErrorHandlerService,
  ) {
    super();
  }

  override async handleError(error: Error): Promise<void> {
    if (error instanceof HttpErrorResponse) {
      if (error.error?.error) {
        this.apiErrorHandlerService.handleError(error);
      } else {
        this.httpErrorHandlerService.handleError(error);
      }
    } else {
      this.scriptErrorHandlerService.handleError(error);
    }

    super.handleError(error);
  }
}
