import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { LocalDatabaseService } from './local-database.service';

@Injectable({
  providedIn: 'root',
})
export class CommonAPIService {
  constructor(
    private httpRequestService: HttpRequestService,
    private localDbService: LocalDatabaseService
  ) {}

  async getBunkerStockDetails(): Promise<any> {
    try {
      const { data } = await this.httpRequestService
        .request('get', 'bunker-reports')
        .toPromise();
      this.localDbService.putCache('BUNKER_STOCK', data).then();
      return data;
    } catch (err) {
      const result = await this.localDbService.getCache('BUNKER_STOCK');
      console.log('bumker stock detaiols', result);
      return result;
    }
  }
}
