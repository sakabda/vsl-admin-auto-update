import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import plugin from 'pouchdb-find';
PouchDB.plugin(plugin);
import { v4 as uuidv4 } from 'uuid';
import { HttpRequestService } from './http-request.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LocalDatabaseService {
  vesselReportDb: PouchDB.Database;
  buttonLoading!: false;
  isUpdate: any;
  cacheDb: PouchDB.Database;
  allReports: any;
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  search = '';
  data: any[] = [];
  $syncSubject: Subject<any> = new Subject<any>();
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.vesselReportDb = this.createDatabase('vessel_report', 50);
    this.vesselReportDb.createIndex({
      index: { fields: ['Report_Type'] },
    });
    this.vesselReportDb.info().then((info) => {
      //this.syncWithServer();
      // this.getDataByReportType(['At Port'])
    });
    this.cacheDb = this.createDatabase('cache_db', 100);
    this.cacheDb.createIndex({
      index: { fields: ['type'] },
    });
    this.cacheDb.info().then();
  }

  public async putCache(type: string, values: any[]): Promise<void> {
    const result = await this.cacheDb.bulkDocs([
      ...values.map((x: any) => ({ ...x, type })),
    ]);
  }

  public async getCache(type: string): Promise<any> {
    const result = await this.cacheDb.find({
      selector: {
        type,
      },
    });
    return result.docs;
  }

  public createDatabase(dbName: string, size: number): PouchDB.Database {
    const db = new PouchDB(dbName, { size: size });
    return db;
  }

  public async getDataByReportType(reportTypes: string[]): Promise<any> {
    const result = await this.vesselReportDb.find({
      selector: {
        Report_Type: { $in: reportTypes },
      },
    });
    console.log('CURRENT DATA', result);
    return result;
  }

  public async deleteAll(): Promise<void> {
    const allDocs = await this.vesselReportDb.allDocs({ include_docs: true });
    await Promise.all(
      allDocs.rows.map((x) => this.vesselReportDb.remove(x.id, x.value.rev))
    );
  }

  public async add(doc: any, id?: string): Promise<any> {
    try {
      if (!doc._id) {
        doc._id = uuidv4();
      }
      if (id) {
        doc._id = id;
      }
      console.log('doc id', doc);
      //return;
      console.log('before put');
      await this.vesselReportDb.put(doc);
      console.log('after put');
      await this.syncWithServer();

      this.router.navigateByUrl('/main/machinery-report/daily-report');
    } catch (error: any) {
      console.log('update error', error);
    }
  }

  public async getById(id: string): Promise<any> {
    return await this.vesselReportDb.get(id);
  }

  public async syncWithServer(): Promise<void> {
    console.log('syncWithServer');
    // this.vesselReportDb.sync('http://127.0.0.1:5984/vessel_report', {
    //   live: true,
    //   retry: true
    // });
    // Get all Data from PouchDB
    try {
      const data = await this.vesselReportDb.allDocs({
        include_docs: true,
        attachments: true,
      });

      console.log('data1', data);

      for (const row of data.rows) {
        try {
          if (row.doc) {
            const doc: any = row.doc;
            console.log('doc', doc);
            //delete doc._id;
            console.log('loop count');
            await this.callAPI(doc.Report_Type, doc, doc._id);
            await this.vesselReportDb.remove(doc);
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.$syncSubject.next();
    }
  }

  async callAPI(type: string, doc: any, id?: string): Promise<void> {
    try {
      console.log('callAPI', type, doc, id);
      //const finalData = delete doc._id;
      console.log('IS UPDATE id', id, doc, type);
      this.isUpdate = id && id.match(/^[0-9a-fA-F]{24}$/);
      console.log('IS UPDATE??', this.isUpdate?.input);
      let isUpdateId = this.isUpdate?.input;

      switch (type) {
        case 'Bunkering report':
          this.httpRequestService
            .request('post', 'bunker-reports', doc)
            .subscribe(
              (result) => {
                console.log('sucess', result);
                this.vesselReportDb.remove(doc._id, doc._rev);
                //window.location.reload();
                this.notificationService.success(
                  '',
                  'Bunker Report Added Successfully '
                );
                this.buttonLoading = false;
                this.router.navigateByUrl(
                  '/main/bunker-stock-report/bunker-report'
                );
              },
              (error: any) => {
                if (error.error.errors) {
                  const allErrors: string[] = Object.values(error.error.errors);
                  for (const err of allErrors) {
                    this.notificationService.error('', err);
                  }
                } else {
                  this.notificationService.error('', error.error.message);
                }
                this.buttonLoading = false;
              }
            );
          break;

        case 'At Sea':
          if (isUpdateId) {
            await this.httpRequestService
              .request('put', `daily-report-at-seas/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-at-seas', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;
        case 'Fuel Changeover':
          if (isUpdateId) {
            await this.httpRequestService
              .request('put', `daily-report-fuel-changeovers/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-fuel-changeovers', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;
        case 'At Port':
          if (isUpdateId) {
            console.log('is upadte in if');
            await this.httpRequestService
              .request('put', `daily-report-at-ports/${id}`, doc)
              .toPromise();
          } else {
            console.log('after inser api call', doc);
            await this.httpRequestService
              .request('post', 'daily-report-at-ports', doc)
              .toPromise();
            console.log('after insert');
            //await this.vesselReportDb.remove(doc._id, doc._rev);
            console.log('after remove local db doc', doc._id, doc._rev);
            const getId = await this.getById(doc._id);
            console.log('after delete', getId);
          }

          break;
        case 'At Anchorage':
          if (isUpdateId) {
            await this.httpRequestService
              .request('put', `daily-report-at-anchorages/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-at-anchorages', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;
        case 'Drifting':
          if (isUpdateId) {
            console.log('in drift update call', isUpdateId);
            await this.httpRequestService
              .request('put', `daily-report-at-driftings/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-at-driftings', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;
        case 'Manoeuvring Arrival':
          if (isUpdateId) {
            await this.httpRequestService
              .request('put', `daily-report-manoeuvring-arrivals/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-manoeuvring-arrivals', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;
        case 'Manoeuvring Departure':
          if (isUpdateId) {
            await this.httpRequestService
              .request('put', `daily-report-manoeuvring-departures/${id}`, doc)
              .toPromise();
          } else {
            await this.httpRequestService
              .request('post', 'daily-report-manoeuvring-departures', doc)
              .toPromise();
            //await this.vesselReportDb.remove(doc._id, doc._rev);
          }

          break;

        default:
          console.log('out');
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
