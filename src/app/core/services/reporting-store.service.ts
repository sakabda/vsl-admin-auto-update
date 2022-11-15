import { Injectable } from '@angular/core';
import { LocalDatabaseService } from './local-database.service';

@Injectable({
  providedIn: 'root',
})
export class ReportingStoreService {
  constructor(private localDbService: LocalDatabaseService) {}

  /**
   * Store At Port Data
   * @param data Data Object
   * @param id ID for Update
   */
  async storeAtDb(data: any, id?: string): Promise<void> {
    console.log('data id', data, id);
    try {
      const result = await this.localDbService.add(data, id);
    } catch (error) {
      console.error(error);
    }
  }
}
