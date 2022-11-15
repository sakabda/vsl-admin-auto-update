import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor() {}
  get apiUrl(): string {
    return environment.production
      ? 'https://vslapi.meancloud.in'
      // ? 'https://api.pangia.blue'
      : // https://api.vslperformance.com
        
        'https://vslapi.meancloud.in';
        // 'https://api.pangia.blue';
  }

  get reviewBaseUrl(): string {
    return environment.production
      ? 'https://vslapi.meancloud.in'
      : 'https://vslapi.meancloud.in';
  }

  get mediaBaseUrl(): string {
    return environment.production
      ? 'https://bt-dev-storage.s3.ap-south-1.amazonaws.com/'
      : 'https://bt-dev-storage.s3.ap-south-1.amazonaws.com/';
  }

  get appVersion(): number {
    return environment.production ? 7 : 7;
  }

  // constructor() {}
  // get apiUrl(): string {
  //   return environment.production
  //     ? 'http://localhost:5001'
  //     : 'http://localhost:5001';
  // }
  // get reviewBaseUrl(): string {
  //   return environment.production
  //     ? 'http://localhost:4200'
  //     : 'http://localhost:4200';
  // }

  // get mediaBaseUrl(): string {
  //   return environment.production
  //     ? 'http://localhost:5001/'
  //     : 'http://localhost:5001/';
  // }
}
