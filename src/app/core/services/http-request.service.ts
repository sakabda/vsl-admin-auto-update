import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { catchError } from 'rxjs/operators';
import { CommunicationService } from './communication.service';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  apiUrl = '';
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService,
    private communicationService: CommunicationService,
    private logService: LogService
  ) {
    this.apiUrl = configurationService.apiUrl;
  }

  public fileRequest(endpoint: string, data?: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/api/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${this.localStorageService.getItem(
          'token',
          false
        )}`,
      },
    });
  }

  public request(
    method = 'get',
    endpoint: string,
    data?: any,
    authorised: boolean = true
  ): Observable<any> {
    let observable: any;
    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' + this.localStorageService.getItem('token', false),
    };
    if (!authorised) {
      headers.Authorization = '';
    }
    switch (method) {
      case 'post':
        observable = this.httpClient.post(
          `${this.apiUrl}/api/${endpoint}`,
          data,
          { headers }
        );
        break;
      case 'put':
        observable = this.httpClient.put(
          `${this.apiUrl}/api/${endpoint}`,
          data,
          { headers }
        );
        break;
      case 'delete':
        observable = this.httpClient.delete(`${this.apiUrl}/api/${endpoint}`, {
          headers,
        });
        break;
      default:
        observable = this.httpClient.get(`${this.apiUrl}/api/${endpoint}`, {
          params: data,
          headers,
        });
    }
    return observable.pipe(
      catchError((err) => {
        this.logService.logApiError(endpoint, method, err);
        if (err.status === 401) {
          this.communicationService.authLogout.next();
          return throwError(err);
        } else if (err.error.message) {
          return throwError(err);
        } else {
          return throwError({
            error: new Error('Internet connection not available.'),
          });
        }
      })
    );
  }
}
