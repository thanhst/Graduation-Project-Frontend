import { Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  async loadComponent<T extends object>(
    container: ViewContainerRef,
    importFn: () => Promise<{ [key: string]: Type<T> }>,
    exportName: string,
    inputs?: Partial<T>,
    outputs?: { [K in keyof T]?: (value: any) => void }
  ): Promise<any> {
    container.clear();
    const module = await importFn();
    const component = module[exportName];
    const componentRef = container.createComponent(component);

    // Gán input
    if (inputs) Object.assign(componentRef.instance,inputs);

    // Gán output
    if (outputs) {
      for (const [key, handler] of Object.entries(outputs)) {
        (componentRef.instance as any)[key]?.subscribe?.(handler);
      }
    }

    return componentRef;
  }

  unloadComponent(container: ViewContainerRef, ref: any) {
    if (ref) ref.destroy();
    container.clear();
  }
}
