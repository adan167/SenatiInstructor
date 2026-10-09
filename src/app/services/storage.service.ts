import { Injectable } from '@angular/core';
import { EntregaPendiente, ObservacionInstructorLocal } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly databaseName = 'senatiTaskHub';
  private readonly storeName = 'entregas_pendientes';
  private readonly observationsStoreName = 'observaciones_instructor';

  async guardarEntregaLocal(
    entrega: Omit<EntregaPendiente, 'id' | 'fechaRegistro' | 'estadoSincronizacion'>
  ): Promise<void> {
    const database = await this.abrirBaseDeDatos();
    const transaction = database.transaction(this.storeName, 'readwrite');
    const record: EntregaPendiente = {
      ...entrega,
      id: globalThis.crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
      estadoSincronizacion: 'PENDIENTE'
    };

    return new Promise<void>((resolve, reject) => {
      transaction.objectStore(this.storeName).add(record);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error ?? new Error('No se pudo guardar la entrega en IndexedDB.'));
      };
      transaction.onabort = () => {
        database.close();
        reject(transaction.error ?? new Error('La transacción de IndexedDB fue cancelada.'));
      };
    });
  }

  async guardarObservacionInstructorLocal(
    observacion: Omit<ObservacionInstructorLocal, 'id' | 'fechaRegistro' | 'estadoSincronizacion'>
  ): Promise<void> {
    const database = await this.abrirBaseDeDatos();
    const transaction = database.transaction(this.observationsStoreName, 'readwrite');
    const record: ObservacionInstructorLocal = {
      ...observacion,
      id: globalThis.crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
      estadoSincronizacion: 'PENDIENTE'
    };

    return new Promise<void>((resolve, reject) => {
      transaction.objectStore(this.observationsStoreName).add(record);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error ?? new Error('No se pudo guardar la observación en IndexedDB.'));
      };
      transaction.onabort = () => {
        database.close();
        reject(transaction.error ?? new Error('La transacción de observación fue cancelada.'));
      };
    });
  }

  private abrirBaseDeDatos(): Promise<IDBDatabase> {
    if (!globalThis.indexedDB) {
      return Promise.reject(new Error('Este navegador no permite almacenamiento IndexedDB.'));
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = globalThis.indexedDB.open(this.databaseName, 2);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(this.observationsStoreName)) {
          database.createObjectStore(this.observationsStoreName, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        reject(request.error ?? new Error('No se pudo abrir la base de datos local.'));
      };
      request.onblocked = () => {
        reject(new Error('La actualización de la base de datos local está bloqueada.'));
      };
    });
  }
}
