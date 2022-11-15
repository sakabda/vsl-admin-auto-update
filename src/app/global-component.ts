export class GlobalComponent {
  public static PouchDB = require('pouchdb').default;
  public static db = new PouchDB('vessel_reports');
}
