import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { HttpRequestService } from './http-request.service';
import { CommunicationService } from './communication.service';
interface AuthState {
  authenticated: boolean;
  user: null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // users: any = [
  //   {
  //     name: 'Administrator',
  //     username: 'admin',
  //     password: '123456',
  //     role: 'admin',
  //   },
  //   {
  //     name: 'User',
  //     username: 'user',
  //     password: '123456',
  //     role: 'user',
  //   },
  // ];
  private authenticationState: ReplaySubject<AuthState> =
    new ReplaySubject<AuthState>(1);

  constructor(
    private localStorageService: LocalStorageService,
    private httpRequestService: HttpRequestService,
    private communicationService: CommunicationService
  ) {
    this.communicationService.authLogout.subscribe((success) => {
      this.logout();
    });
    /**
     * Check Logged in Logic
     */
    const user = localStorageService.getItem('user');
    const token = localStorageService.getItem('token', false);
    //const expiry = localStorageService.getItem('expiry');
    const authenticated = !!user && !!token;
    //const authenticated = !user;
    this.authenticationState.next({ authenticated, user: user || null });
  }
  public get authState(): Observable<AuthState> {
    return this.authenticationState as Observable<AuthState>;
  }
  public getLocalUser(): any {
    return this.localStorageService.getItem('user');
  }
  public setLocalUser(user: any): void {
    this.localStorageService.setItem('user', user);
    this.authenticationState.next({ authenticated: true, user });
  }
  private setLocalToken(token: string): void {
    this.localStorageService.setItem('token', token);
  }
  public async login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService
        .request('post', 'auth/login', { email, password })
        .subscribe(
          (success) => {
            const loginResponse = success.data;
            console.log('response login', loginResponse);
            this.setLocalUser(loginResponse.user);
            this.setLocalToken(loginResponse.token);
            resolve(loginResponse.user);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  public async logout(): Promise<any> {
    /**
     * Replace with API Call
     */
    return new Promise<void>((resolve, reject) => {
      this.localStorageService.removeItem('user');
      this.localStorageService.removeItem('token');
      this.authenticationState.next({ authenticated: false, user: null });
      resolve();
    });
  }
}
