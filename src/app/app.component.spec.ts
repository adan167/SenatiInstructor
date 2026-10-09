import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StorageService } from './services/storage.service';

describe('AppComponent', () => {
  const storageService = jasmine.createSpyObj<StorageService>('StorageService', [
    'guardarObservacionInstructorLocal'
  ]);

  beforeEach(async () => {
    storageService.guardarObservacionInstructorLocal.and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: StorageService, useValue: storageService }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    storageService.guardarObservacionInstructorLocal.calls.reset();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'SENATI TaskHub' title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('SENATI TaskHub');
  });

  it('should render the instructor panel', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Mis Cursos');
    expect(compiled.querySelectorAll('.course-item').length).toBe(4);
    expect(compiled.querySelector('.bottom-nav')).toBeNull();
  });

  it('should show online and offline connection states', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.actualizarEstadoOnline();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-banner')?.classList).toContain('is-online');
    expect(fixture.nativeElement.querySelector('.status-text')?.textContent).toContain('CON CONEXIÓN');

    app.actualizarEstadoOffline();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-banner')?.classList).toContain('is-offline');
    expect(fixture.nativeElement.querySelector('.status-text')?.textContent).toContain('SIN CONEXIÓN');
  });

  it('should save an instructor observation and clear its fields', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.cursoObservacion = 'Software PWA';
    app.nombreTareaLocal = 'Revisión de avance';
    app.observacionesLocal = 'Revisar la práctica del módulo.';

    await app.guardarObservacionInstructorLocal();

    expect(storageService.guardarObservacionInstructorLocal).toHaveBeenCalledWith({
      curso: 'Software PWA',
      nombreTarea: 'Revisión de avance',
      observaciones: 'Revisar la práctica del módulo.'
    });
    expect(app.mensajeObservacion).toContain('Se guardó en tu dispositivo');
    expect(app.nombreTareaLocal).toBe('');
    expect(app.observacionesLocal).toBe('');
  });
});
