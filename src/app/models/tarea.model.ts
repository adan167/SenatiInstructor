export interface Tarea {
  id: number;
  curso: string;
  titulo: string;
  instructor: string;
  fechaEntrega: string;
  estado: string;
}

export interface EntregaPendiente {
  id: string;
  tareaId: number;
  comentario: string;
  usuario: string;
  fechaRegistro: string;
  estadoSincronizacion: 'PENDIENTE';
}

export interface ObservacionInstructorLocal {
  id: string;
  curso: string;
  nombreTarea: string;
  observaciones: string;
  fechaRegistro: string;
  estadoSincronizacion: 'PENDIENTE';
}
