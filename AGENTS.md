# Repository Guidelines

## Estructura del Proyecto y Organización de Módulos
Este repositorio está vacío por ahora. Para dejar una base consistente, ubica el código fuente en `src/`, las pruebas en `tests/` y los recursos estáticos en `assets/` si el proyecto los necesita. La configuración global debe quedarse en la raíz, por ejemplo `package.json`, `pyproject.toml` o `.editorconfig`.

Organiza los módulos por funcionalidad o dominio desde el inicio. Estructura sugerida:

```text
src/
tests/
assets/
```

## Comandos de Build, Pruebas y Desarrollo
Todavía no hay comandos definidos en este directorio. Cuando se incorpore el stack del proyecto, documenta aquí y en el `README` los flujos reales de trabajo.

Comandos esperados una vez exista tooling:
- `npm run dev` o `make dev`: inicia el entorno local.
- `npm test` o `pytest`: ejecuta la suite de pruebas.
- `npm run build` o `make build`: genera la versión de producción.

No agregues comandos a esta guía si el repositorio todavía no los soporta.

## Estilo de Código y Convenciones de Nombres
Mantén formato y reglas consistentes desde el primer commit. Convenciones recomendadas:
- 2 espacios para JavaScript o TypeScript; 4 espacios para Python.
- `camelCase` para variables y funciones.
- `PascalCase` para clases y componentes.
- Nombres de archivo descriptivos como `customer_list.tsx` o `test_auth.py`.

Cuando se defina el stack, incorpora herramientas de formato y linting acordes, por ejemplo `Prettier` y `ESLint`, o `ruff` y `black`.

## Guía de Pruebas
Ubica las pruebas en `tests/` o junto al código solo si el framework lo favorece claramente. Usa nombres alineados con el comportamiento validado, por ejemplo `tests/test_contacts.py` o `src/auth/auth.spec.ts`.

Empieza con pruebas unitarias sobre lógica crítica y agrega pruebas de integración cuando existan flujos compartidos. Define objetivos de cobertura solo cuando ya exista un runner configurado.

## Commits y Pull Requests
Este directorio no contiene historial Git, así que no es posible inferir una convención local. Usa mensajes de commit breves, en modo imperativo, por ejemplo `Agrega validación de importación de contactos`.

Cada pull request debe incluir:
- resumen claro del cambio
- referencia al issue o tarea, si aplica
- evidencia de pruebas ejecutadas
- capturas si hay cambios de interfaz

## Seguridad y Configuración
No subas secretos, archivos `.env` locales ni credenciales generadas. Mantén ejemplos versionados en archivos como `.env.example` y documenta las variables requeridas cerca del código que las consume.
