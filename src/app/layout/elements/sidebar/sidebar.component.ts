import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NzImageModule } from 'ng-zorro-antd/image';
import {
  AuthService,
  HttpRequestService,
  LocalStorageService,
  MenuService,
} from '../../../core/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuData: any[] = [];
  currentRoute = '';
  @Input() isCollapsed = true;
  @Output() isCollapsedChange: EventEmitter<boolean> = new EventEmitter();
  menuChildren: Subject<any[]> = new Subject<any[]>();
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
    private httpRequestService: HttpRequestService,
    private localStorageService: LocalStorageService
  ) {
    // this.menuService.menu.subscribe((menudata) => {
    //   this.menuData = menudata;
    //   this.router.events.subscribe((event: any) => {
    //     if (event instanceof NavigationStart) {
    //       this.menuData.forEach((menu) => {
    //         menu.selected = event.url.includes(menu.route);
    //       });
    //     }
    //   });

    //   this.menuChildren.subscribe((success) => {
    //     this.menuData.forEach((menu) => {
    //       menu.isOpen = this.currentRoute.includes(menu.route);
    //       if (menu.key === 'workSpaceManagement') {
    //         menu.children = success;
    //       }
    //     });
    //   });
    // });
    this.menuService.menu.subscribe((menudata) => {
      this.menuData = menudata;
      console.log('menudata', this.menuData);
      this.menuData.forEach((menu) => {
        menu.isOpen = this.currentRoute.includes(menu.route);
      });
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    const user = this.localStorageService.getItem('user');

    this.authService.authState.subscribe((status) => {});
    this.menuService.generateMenu(user);
  }

  sendOnMenu(): void {
    if (window.innerWidth < 800) {
      this.isCollapsed = !this.isCollapsed;
      this.isCollapsedChange.emit(this.isCollapsed);
    }
  }
  openHandler(key: string): void {
    this.menuData.forEach((x) => {
      if (x.key !== key) {
        x.isOpen = false;
      }
    });
  }
}
