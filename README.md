# 🎯 Rifas JoCar (Versión Beta)

Sistema de gestión de rifas digital para la empresa JoCar. Permite la selección de números, gestión de tickets y visualización del estado de la rifa en tiempo real.

## 🚀 Funcionalidades

### 📱 Interfaz Responsiva
- Diseño adaptativo para móviles, tablets y computadoras
- Navegación intuitiva entre secciones
- Botones optimizados para pantallas táctiles

### 🎲 Selección de Números
- **Cuadrícula visual**: 1000 números (000-999) organizados en grid
- **Selección manual**: Click en números disponibles
- **Selección automática**: Botón "ELEGIR A LA SUERTE" para selección aleatoria
- **Límite configurable**: Máximo 10 números por compra
- **Estado visual**: Números disponibles, seleccionados y ocupados con colores distintivos

### 🎫 Gestión de Tickets
- **Registro de compradores**: Nombre, cédula y teléfono
- **Búsqueda avanzada**: Filtro por número, nombre, cédula o teléfono
- **Tabla visual**: Estado de todos los números (000-999) con colores
- **Leyenda clara**: Verde para disponibles, Rojo para vendidos

### 🔄 Reinicio de Rifa
- **Botón de reinicio**: Elimina todos los tickets de una vez
- **Confirmación de seguridad**: Previene eliminación accidental
- **Liberación automática**: Marca todos los números como disponibles
- **Persistencia**: Datos guardados en localStorage del navegador

## 🛠️ Elementos del Proyecto

### 📄 Archivos Principales
- `index.html` - Estructura HTML principal
- `style.css` - Estilos y diseño responsivo
- `app.js` - Lógica de funcionalidad y eventos
- `logo-jocar.png` - Logo de la empresa

### 🎨 Componentes de Interfaz

#### Navegación
- **Barra superior**: Botones "Seleccionar Números" y "Ver Tickets"
- **Estados activos**: Indicadores visuales de sección actual

#### Panel de Selección
- **Botón de suerte**: Selección aleatoria con iconos de estrella
- **Contador superior**: Muestra números seleccionados vs máximo
- **Grid de números**: 1000 números organizados en filas de 10

#### Panel de Tickets
- **Tabla visual**: Estado de números con colores
- **Buscador**: Filtro en tiempo real
- **Lista de tickets**: Información de compradores
- **Botón de reinicio**: Eliminación masiva de tickets

#### Modal de Datos
- **Formulario**: Captura nombre, cédula y teléfono
- **Validación**: Campos requeridos y formatos
- **Confirmación**: Resumen de números seleccionados

### 💾 Almacenamiento
- **localStorage**: Persistencia de tickets entre sesiones
- **Estructura JSON**: Datos organizados por número de ticket
- **Backup automático**: Guardado instantáneo al agregar tickets

  
## 📋 Características Técnicas

- **Sin dependencias externas**: Funciona offline
- **Progressive Web App**: Instalable en dispositivos
- **Optimizado para móviles**: Touch-friendly
- **Accesibilidad**: Navegación por teclado
- **Performance**: Carga rápida y fluida

---

