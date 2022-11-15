import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { IpcService } from 'src/app/ipc.service';
//import log from 'electron-log';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(
    private _electronService: ElectronService,
    private readonly _ipc: IpcService
  ) {
  }

  public logApiError(url: string, method: string, error: Error): void {
    if (this._electronService.isElectronApp) {
      this._ipc.send('error', `
        (API ERROR) METHOD: ${method.toUpperCase()} | API URL: ${url} | Message: ${error.message}
      `);
    }
  }
}
