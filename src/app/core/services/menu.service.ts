import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { adminMenu } from '../data/menu.data';
import { supplyVesselMenu } from '../data/menu.data';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menu: Subject<any[]> = new Subject<any[]>();

  constructor() {}
  public async generateMenu(user: any): Promise<any> {
    this.menu.next(adminMenu);
    if (user.Unique_Group != 'SUPPLY') {
      this.menu.next(adminMenu);
    }
    if (user.Unique_Group === 'SUPPLY') {
      this.menu.next(supplyVesselMenu);
    }

    // switch (user.role) {
    //   case 'admin':
    //     this.menu.next(adminMenu);
    //     break;
    //     case 'supplyVesselMenu':
    //       this.menu.next(supplyVesselMenu);

    //     break;
    //   case 'default':
    //     break;
    // }
  }
}
