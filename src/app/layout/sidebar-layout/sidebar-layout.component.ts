import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss'],
})
export class SidebarLayoutComponent implements OnInit {
  isCollapsed = false;
  conWidth: any;
  colWidth: any;
  constructor() {}

  ngOnInit(): void {
    //  this.conWidth = window.innerWidth < 800 ? '80px' : '250px';
    // this.colWidth = window.innerWidth < 800 ? '0' : '80';
  }
  // onCollapseChange(value: any): void {
  //   this.isCollapsed = value;
  // }
}
