# SENATI TaskHub

Aplicación web progresiva para consultar tareas académicas y registrar avances, incluso sin conexión.

## Desarrollo

```bash
npm install
npm start
```

Abre `http://localhost:4200/`. El catálogo de ejemplo está en `public/assets/data/tareas.json`.

## Funciones

- Manifiesto PWA con identidad visual de SENATI.
- Caché del catálogo de tareas y de los recursos de la aplicación mediante Angular Service Worker.
- Indicador de conectividad y almacenamiento de entregas en IndexedDB con estado `PENDIENTE`.
- Diseño adaptable para escritorio y dispositivos móviles.

El proyecto no incluye una API del Campus Virtual. Por eso, las entregas se conservan en el dispositivo y quedan pendientes de sincronización; no se informa que fueron enviadas a un servidor.

## Verificación

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```
