# Configuración de GitHub Pages con dominio personalizado

Guía para configurar `pindia.es` como dominio personalizado en GitHub Pages.

**Fecha de actualización:** 28 de abril de 2026

---

## Configuración Actual del DNS (pindia.es)

Registros existentes en el gestor DNS:

| Nombre | TTL | Clase | Tipo | Registro |
|--------|-----|-------|------|----------|
| mail | 60 | IN | CNAME | ghs.google.com. |
| www | 60 | IN | CNAME | pindia.es. |
| nnpjqyvjb7xm | 60 | IN | CNAME | gv-7ar7cbleml345s.dv.googlehosted.com. |

---

## Pasos de Configuración (Opción 2: CNAME)

### 1. Crear archivo CNAME en el repositorio

En la raíz del repositorio `web-pindia/`, crea un archivo `CNAME` (sin extensión) con el contenido:

```
pindia.es
```

Commitea y pushea:
```bash
git add CNAME
git commit -m "Añade CNAME para dominio personalizado pindia.es"
git push origin main
```

### 2. Configurar DNS (Opción 2: CNAME)

En el **Editor de Zonas DNS** del registrador:

**Reemplaza el registro `www` actual** por:

| Nombre | TTL | Clase | Tipo | Registro |
|--------|-----|-------|------|----------|
| www | 60 | IN | CNAME | trowelapp-technologies-sl.github.io. |

**Pasos en la interfaz:**
1. Busca el registro `www` existente (que actualmente apunta a `pindia.es.`)
2. Haz clic en el menú de acciones (⋮) y elimínalo o edítalo
3. Crea un nuevo registro CNAME:
   - **Nombre:** `www`
   - **TTL:** 60
   - **Tipo:** CNAME
   - **Registro:** `trowelapp-technologies-sl.github.io.`
4. Guarda los cambios

### 3. Configurar GitHub Pages

1. Ve a **Settings → Pages** en el repositorio `web-pindia`
2. En la sección "Custom domain", ingresa: `pindia.es`
3. GitHub detectará automáticamente el archivo `CNAME` y lo validará
4. Espera a que aparezca el checkmark verde (5-10 minutos)
5. Marca **"Enforce HTTPS"** una vez esté disponible

### 4. Verificar la configuración

```bash
# Verifica que el CNAME apunta correctamente
dig www.pindia.es

# Deberías ver:
# www.pindia.es. 60 IN CNAME trowelapp-technologies-sl.github.io.
# trowelapp-technologies-sl.github.io. IN A 185.199.108.153
# (y otras direcciones IP de GitHub)
```

---

## Información Adicional

**Organización GitHub:** `trowelapp-technologies-sl`

**Repositorio:** `web-pindia`

**URL actual en GitHub Pages:** `https://trowelapp-technologies-sl.github.io/`

**Dominio apex:** `pindia.es`

**Dominio con www:** `www.pindia.es`

**Nota sobre TTL:** Los cambios DNS pueden tardar hasta 24-48 horas en propagarse globalmente, aunque normalmente se ven en minutos.

---

## Rollback / Restauración

Si algo se rompe y necesitas volver atrás:

1. Elimina el contenido del archivo `CNAME` o bórralo del repositorio
2. En GitHub Pages Settings, limpia el campo "Custom domain"
3. El sitio seguirá siendo accesible en `borjagarciacueto.github.io`
4. En DNS, puedes revertir el registro `www` a su estado anterior

---

## Alternativa: Usar registros A (Opción 1)

Si prefieres usar registros A en el apex del dominio (sin subdominio):

| Nombre | TTL | Tipo | Valor |
|--------|-----|------|-------|
| (vacío/apex) | 60 | A | 185.199.108.153 |
| (vacío/apex) | 60 | A | 185.199.109.153 |
| (vacío/apex) | 60 | A | 185.199.110.153 |
| (vacío/apex) | 60 | A | 185.199.111.153 |
| www | 60 | CNAME | pindia.es. |

Esta opción es más estándar pero más compleja. La Opción 2 (CNAME) es suficiente y más fácil de mantener.
