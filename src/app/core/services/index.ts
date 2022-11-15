import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { ConfigurationService } from './configuration.service';
import { MenuService } from './menu.service';
import { HttpRequestService } from './http-request.service';

export const services: any[] = [AuthService, LocalStorageService, ConfigurationService, MenuService, HttpRequestService];

export * from './auth.service';
export * from './local-storage.service';
export * from './configuration.service';
export * from './menu.service';
export * from './http-request.service';

