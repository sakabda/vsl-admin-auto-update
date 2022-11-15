import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * SET LOCAL STORAGE ITEM
   * @param key: string
   * @param value: any
   */
  public setItem(key: string, value: any): boolean {
    if (!key || !value) {
      return false;
    }
    if (typeof(value) === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  }

  /**
   * GET LOCAL STORAGE ITEM
   * @param key: string;
   * @param parsed: boolean;
   */
  public getItem(key: string, parsed: boolean = true): any {
    return parsed ? JSON.parse(localStorage.getItem(key) || '{}') : localStorage.getItem(key);
  }

  /**
   * DELETE LOCAL STORAGE ITEM
   * @param key: string
   */
  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * CLEAR LOCAL STORAGE
   */
  public clearStorage(): void {
    localStorage.clear();
  }
}
