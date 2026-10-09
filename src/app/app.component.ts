import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'SENATI TaskHub';
  readonly cursosInstructor = [
    { nombre: 'Software PWA', pendiente: 15, icono: '🧩' },
    { nombre: 'Desarrollo PWA', pendiente: 15, icono: '🧠' },
    { nombre: 'Base de Datos Avanzada', pendiente: 17, icono: '🗃️' },
    { nombre: 'IA Aplicada', pendiente: 10, icono: '📐' }
  ];
  cursoObservacion = this.cursosInstructor[0].nombre;
  nombreTareaLocal = '';
  observacionesLocal = '';
  mensajeObservacion = '';
  guardandoObservacion = false;
  online = globalThis.navigator.onLine;

  private readonly storageService = inject(StorageService);

  @HostListener('window:online')
  actualizarEstadoOnline(): void {
    this.online = true;
  }

  @HostListener('window:offline')
  actualizarEstadoOffline(): void {
    this.online = false;
  }

  async guardarObservacionInstructorLocal(): Promise<void> {
    const nombreTarea = this.nombreTareaLocal.trim();
    const observaciones = this.observacionesLocal.trim();
    if (this.guardandoObservacion || !this.cursoObservacion || !nombreTarea || !observaciones) {
      return;
    }

    this.guardandoObservacion = true;
    this.mensajeObservacion = '';
    try {
      await this.storageService.guardarObservacionInstructorLocal({
        curso: this.cursoObservacion,
        nombreTarea,
        observaciones
      });
      this.mensajeObservacion = this.online
        ? 'Se guardó en tu dispositivo. El registro también estará disponible sin conexión.'
        : 'Se guardó en tu dispositivo sin conexión y estará disponible cuando vuelvas a conectarte.';
      this.nombreTareaLocal = '';
      this.observacionesLocal = '';
    } catch (error: unknown) {
      console.error('No se pudo guardar la observación local.', error);
      this.mensajeObservacion = error instanceof Error
        ? `No se pudo guardar: ${error.message}`
        : 'No se pudo guardar la observación en este dispositivo.';
    } finally {
      this.guardandoObservacion = false;
    }
  }
}
