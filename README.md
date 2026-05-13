# LifeXP

LifeXP es un prototipo viable de web app gratuita para crear habitos, configurar recordatorios, registrar avances, revisar progreso, desbloquear logros, reducir ciclos y personalizar la experiencia con avatar.

El proyecto fue creado por Links Visual Division.  
Diseño y desarrollo: Juan David.

## Estado

Prototipo viable, preparado para evolucionar a PWA y app movil.

## Funciones principales

- Bienvenida con identidad visual oficial de LifeXP.
- Onboarding inteligente con sugerencias de rutina.
- Perfil local con nombre, objetivo, avatar, tema y preferencias.
- Habitos personalizados con categoria, frecuencia, meta, recordatorio, icono, color y nota.
- Plantillas recomendadas para agregar a la rutina.
- Planes de reduccion para ciclos como higiene digital, consumo o distracciones.
- Pantalla Hoy con progreso diario, check-in, recordatorios y habitos pendientes.
- Pantalla Progreso con rachas, porcentaje semanal, heatmap y analisis simple.
- Logros agrupados por dificultad.
- Ayuda, FAQ, Acerca de y Portafolio de Links Visual Division.
- Exportacion de datos como JSON.
- Datos guardados localmente en el dispositivo mediante `localStorage`.

## Stack

- HTML
- CSS
- JavaScript vanilla con modulos ES
- Vite
- localStorage

No usa React, Next.js, backend, login real ni Supabase.

## Identidad visual

Los SVG oficiales estan en:

```text
public/assets/icons/
|-- lifexp_primary_logo.svg
|-- lifexp_wordmark.svg
`-- lifexp_app_icon.svg
```

El app icon se usa como favicon y en el manifest. El logo completo se usa en bienvenida, Acerca de y Portafolio. El wordmark se usa en headers compactos.

## Rutas principales

- `#bienvenida`
- `#onboarding`
- `#hoy`
- `#habitos`
- `#progreso`
- `#logros`
- `#perfil`
- `#ayuda`

## Estructura

```text
.
|-- public/
|   |-- assets/
|   |   |-- avatars/
|   |   |-- icons/
|   |   `-- og-image.svg
|   |-- favicon.svg
|   `-- manifest.webmanifest
|-- src/
|   |-- data/
|   |-- state/
|   |-- styles/
|   |-- systems/
|   |-- views/
|   |-- app.js
|   |-- main.js
|   `-- router.js
|-- index.html
|-- package.json
`-- README.md
```

## Instalar

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Autoría

© 2026 Links Visual Division. LifeXP — Prototipo viable de web app.  
Diseño y desarrollo: Juan David.
