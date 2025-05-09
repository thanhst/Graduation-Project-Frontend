import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { FlagService } from '../services/flag/flag.service';

@Injectable({
    providedIn: 'root',
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    constructor(private flagService: FlagService) { }
    private storedRoutes = new Map<string, DetachedRouteHandle>();

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // Chỉ lưu lại các route bạn muốn giữ lại
        return route.data?.['reuse'] ?? false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // Lưu route đã tách
        this.storedRoutes.set(route.routeConfig?.path ?? '', handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // Kiểm tra xem route có đã được lưu hay không
        return this.storedRoutes.has(route.routeConfig?.path ?? '');
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        // Lấy lại route đã được lưu\
        Promise.resolve().then(() => {
            this.flagService.setBack(true);
        });
        return this.storedRoutes.get(route.routeConfig?.path ?? '') ?? null;
    }

    shouldReuseRoute(
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot
    ): boolean {
        // So sánh các route để quyết định reuse hay không
        return future.routeConfig === curr.routeConfig;
    }
}
