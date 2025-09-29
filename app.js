// Renderizar la cuadrícula de números 000-999
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('numeros-grid');
  const modal = document.getElementById('modal-datos');
  const cerrarModal = document.getElementById('cerrar-modal');
  const cancelarBtn = document.getElementById('cancelar');
  const form = document.getElementById('form-datos');
  const ticketsList = document.getElementById('tickets-list');
  const numerosSeleccionadosInfo = document.getElementById('numeros-seleccionados-info');
  const btnSuerte = document.getElementById('btn-suerte');
  const panelInferior = document.getElementById('panel-inferior');
  const contadorSeleccionados = document.getElementById('contador-seleccionados');
  const maxSeleccion = document.getElementById('max-seleccion');
  const btnContinuar = document.getElementById('btn-continuar');
  const btnReinicio = document.getElementById('btn-reinicio');
  let seleccionTemp = [];
  const MAX_SELECCION = 10;
  maxSeleccion.textContent = MAX_SELECCION;

  // Cargar ocupados de localStorage
  let tickets = JSON.parse(localStorage.getItem('tickets') || '{}');

  // Renderizar los 1000 números
  for (let i = 0; i < 1000; i++) {
    const numStr = i.toString().padStart(3, '0');
    const div = document.createElement('div');
    div.className = 'numero';
    div.textContent = numStr;
    if (tickets[numStr]) {
      div.classList.add('ocupado');
    }
    div.addEventListener('click', () => {
      if (div.classList.contains('ocupado')) return;
      if (div.classList.contains('seleccionado')) {
        div.classList.remove('seleccionado');
        seleccionTemp = seleccionTemp.filter(n => n !== numStr);
      } else {
        if (seleccionTemp.length >= MAX_SELECCION) return;
        div.classList.add('seleccionado');
        seleccionTemp.push(numStr);
      }
      updatePanelSuperior();
    });
    grid.appendChild(div);
  }

  function updatePanelSuperior() {
    contadorSeleccionados.textContent = seleccionTemp.length;
    if (seleccionTemp.length > 0) {
      btnContinuar.style.display = 'flex';
    } else {
      btnContinuar.style.display = 'none';
    }
  }

  btnContinuar.addEventListener('click', () => {
    if (seleccionTemp.length === 0) return;
    numerosSeleccionadosInfo.textContent = `Números seleccionados (${seleccionTemp.length}): ${seleccionTemp.join(', ')}`;
    modal.classList.remove('oculto');
  });

  btnSuerte.addEventListener('click', () => {
    // Selecciona un número aleatorio disponible
    const disponibles = Array.from(grid.children).filter(div => !div.classList.contains('ocupado') && !div.classList.contains('seleccionado'));
    if (disponibles.length === 0 || seleccionTemp.length >= MAX_SELECCION) return;
    const randomDiv = disponibles[Math.floor(Math.random() * disponibles.length)];
    randomDiv.classList.add('seleccionado');
    seleccionTemp.push(randomDiv.textContent);
    updatePanelSuperior();
  });

  const navSeleccion = document.getElementById('nav-seleccion');
  const navTickets = document.getElementById('nav-tickets');
  const paginaSeleccion = document.getElementById('pagina-seleccion');
  const paginaTickets = document.getElementById('pagina-tickets');
  const busquedaNombre = document.getElementById('busqueda-nombre');
  const btnBuscarNombre = document.getElementById('btn-buscar-nombre');
  const busquedaNumero = document.getElementById('busqueda-numero');
  const btnBuscarNumero = document.getElementById('btn-buscar-numero');
  const busquedaGeneral = document.getElementById('busqueda-general');
  const btnBuscarGeneral = document.getElementById('btn-buscar-general');

  function mostrarSeleccion() {
    paginaSeleccion.style.display = '';
    paginaTickets.style.display = 'none';
    navSeleccion.classList.add('active');
    navTickets.classList.remove('active');
  }
  function mostrarTickets() {
    paginaSeleccion.style.display = 'none';
    paginaTickets.style.display = '';
    navSeleccion.classList.remove('active');
    navTickets.classList.add('active');
    renderTablaVisual(); // Actualizar la tabla visual cuando se muestra la sección
    renderTicketsFiltroGeneral();
  }
  navSeleccion.addEventListener('click', (e) => { e.preventDefault(); mostrarSeleccion(); });
  navTickets.addEventListener('click', (e) => { e.preventDefault(); mostrarTickets(); });

  function renderTicketsFiltroGeneral(filtro = '') {
    ticketsList.innerHTML = '';
    let entries = Object.entries(tickets);
    if (filtro) {
      const f = filtro.trim().toLowerCase();
      // Prioridad: coincidencia exacta de número
      entries = entries.filter(([num, data]) =>
        num === f.padStart(3, '0') ||
        data.nombre.toLowerCase().includes(f) ||
        data.cedula.toLowerCase().includes(f) ||
        data.telefono.toLowerCase().includes(f)
      );
    }
    if (entries.length === 0) {
      ticketsList.innerHTML = '<div style="color:#888;">No se encontraron tickets.</div>';
      return;
    }
    entries.forEach(([num, data]) => {
      const item = document.createElement('div');
      item.className = 'ticket-item';
      item.innerHTML = `<strong>#${num}</strong> - ${data.nombre} | Cédula: ${data.cedula} | Tel: ${data.telefono}`;
      // Botón eliminar
      const btnDel = document.createElement('button');
      btnDel.className = 'ticket-delete';
      btnDel.title = 'Eliminar ticket';
      btnDel.innerHTML = '🗑️';
      btnDel.onclick = () => {
        if (confirm(`¿Eliminar el ticket #${num}?`)) {
          delete tickets[num];
          localStorage.setItem('tickets', JSON.stringify(tickets));
          // Actualizar la grilla principal
          Array.from(grid.children).forEach(div => {
            if (div.textContent === num) {
              div.classList.remove('ocupado');
            }
          });
          renderTicketsFiltroGeneral(busquedaGeneral.value);
          renderTablaVisual(); // Actualizar la tabla visual
        }
      };
      item.appendChild(btnDel);
      ticketsList.appendChild(item);
    });
  }

  btnBuscarGeneral.addEventListener('click', () => {
    renderTicketsFiltroGeneral(busquedaGeneral.value);
  });
  busquedaGeneral.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderTicketsFiltroGeneral(busquedaGeneral.value);
    if (!busquedaGeneral.value) renderTicketsFiltroGeneral();
  });

  function renderTickets() {
    ticketsList.innerHTML = '';
    Object.entries(tickets).forEach(([num, data]) => {
      const item = document.createElement('div');
      item.className = 'ticket-item';
      item.innerHTML = `<strong>#${num}</strong> - ${data.nombre} | Cédula: ${data.cedula} | Tel: ${data.telefono}`;
      ticketsList.appendChild(item);
    });
  }

  // Función para renderizar la tabla visual de números
  function renderTablaVisual() {
    const tablaVisualGrid = document.getElementById('tabla-visual-grid');
    if (!tablaVisualGrid) return;
    
    // Limpiar la tabla existente
    tablaVisualGrid.innerHTML = '';
    
    // Crear las 1000 celdas (000-999)
    for (let i = 0; i < 1000; i++) {
      const numStr = i.toString().padStart(3, '0');
      const celda = document.createElement('div');
      celda.className = 'celda-numero';
      celda.textContent = numStr;
      
      // Verificar si el número está ocupado
      if (tickets[numStr]) {
        celda.classList.add('ocupado');
      } else {
        celda.classList.add('libre');
      }
      
      // Agregar evento click para mostrar información del ticket
      celda.addEventListener('click', () => {
        if (tickets[numStr]) {
          const data = tickets[numStr];
          alert(`Número ${numStr}\nComprador: ${data.nombre}\nCédula: ${data.cedula}\nTeléfono: ${data.telefono}`);
        }
      });
      
      tablaVisualGrid.appendChild(celda);
    }
  }
  
  renderTickets();

  cerrarModal.addEventListener('click', () => {
    modal.classList.add('oculto');
    seleccionTemp = [];
    clearSeleccionados();
    updatePanelSuperior();
  });
  cancelarBtn.addEventListener('click', () => {
    modal.classList.add('oculto');
    seleccionTemp = [];
    clearSeleccionados();
    updatePanelSuperior();
  });

  function clearSeleccionados() {
    Array.from(grid.children).forEach(div => {
      div.classList.remove('seleccionado');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const cedula = form.cedula.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !cedula || !telefono || seleccionTemp.length === 0) return;
    // Guardar los tickets
    seleccionTemp.forEach(num => {
      tickets[num] = { nombre, cedula, telefono };
    });
    localStorage.setItem('tickets', JSON.stringify(tickets));
    // Marcar como ocupados
    Array.from(grid.children).forEach(div => {
      if (seleccionTemp.includes(div.textContent)) {
        div.classList.add('ocupado');
        div.classList.remove('seleccionado');
      }
    });
    renderTicketsFiltroGeneral();
    renderTablaVisual(); // Actualizar la tabla visual
    seleccionTemp = [];
    modal.classList.add('oculto');
    form.reset();
    updatePanelSuperior();
  });

  // Funcionalidad del botón de reinicio
  btnReinicio.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres reiniciar la rifa?\n\nEsto eliminará TODOS los tickets y liberará todos los números.\n\nEsta acción no se puede deshacer.')) {
      // Limpiar todos los tickets
      tickets = {};
      localStorage.setItem('tickets', JSON.stringify(tickets));
      
      // Limpiar la selección temporal
      seleccionTemp = [];
      clearSeleccionados();
      
      // Marcar todos los números como disponibles
      Array.from(grid.children).forEach(div => {
        div.classList.remove('ocupado');
        div.classList.remove('seleccionado');
      });
      
      // Actualizar la interfaz
      renderTicketsFiltroGeneral();
      renderTablaVisual();
      updatePanelSuperior();
      
      // Mostrar mensaje de confirmación
      alert('✅ Rifa reiniciada exitosamente\n\nTodos los tickets han sido eliminados y los números están disponibles nuevamente.');
    }
  });

  updatePanelSuperior();
  mostrarSeleccion();
});

// Fuera del DOMContentLoaded: lógica global para cobros
// (se coloca aquí para evitar usar variables internas no accesibles fuera)
(function() {
  // Construye la lista ordenada de entradas únicas por teléfono (primer ticket por teléfono)
  function obtenerColaCobro() {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '{}');
    const nums = Object.keys(tickets).sort();
    const seen = new Set();
    const cola = [];
    for (const num of nums) {
      const data = tickets[num];
      if (!data || !data.telefono) continue;
      const telNorm = data.telefono.replace(/\D/g, '');
      if (!telNorm) continue;
      if (seen.has(telNorm)) continue; // ya agregamos este teléfono
      seen.add(telNorm);
      cola.push({ num, telefono: data.telefono, nombre: data.nombre });
    }
    return cola;
  }

  function formatearTelefonoParaWA(telefono) {
    if (!telefono) return null;
    let t = telefono.replace(/\D/g, '');
    if (t.length === 10) t = '58' + t; // asumir Venezuela si no tiene código
    return t;
  }

  function actualizarEstadoCobro() {
    const estadoSpan = document.getElementById('cobro-estado');
    const cola = obtenerColaCobro();
    let index = parseInt(localStorage.getItem('cobro_index') || '0', 10);
    if (isNaN(index)) index = 0;
    if (cola.length === 0) {
      estadoSpan.textContent = 'No hay tickets para cobrar.';
    } else if (index >= cola.length) {
      estadoSpan.textContent = `Cobros completados (${cola.length} contactos).`;
    } else {
      const entry = cola[index];
      estadoSpan.textContent = `Siguiente: #${entry.num} — ${entry.nombre || ''} — ${entry.telefono} (contacto ${index+1} de ${cola.length})`;
    }
  }

  function enviarSiguienteCobro() {
    const cola = obtenerColaCobro();
    if (cola.length === 0) {
      alert('No hay tickets para cobrar.');
      return;
    }
    let index = parseInt(localStorage.getItem('cobro_index') || '0', 10);
    if (isNaN(index)) index = 0;
    if (index >= cola.length) {
      alert('Ya se han procesado todos los cobros. Reinicia la cola si quieres volver a empezar.');
      actualizarEstadoCobro();
      return;
    }
    const entry = cola[index];
    if (!entry) {
      // nada por procesar, avanzar
      localStorage.setItem('cobro_index', (index+1).toString());
      actualizarEstadoCobro();
      return;
    }
    const telefonoForm = formatearTelefonoParaWA(entry.telefono);
    if (!telefonoForm) {
      alert(`El contacto del ticket #${entry.num} no tiene un teléfono válido.`);
      // marcar como procesado y continuar
      localStorage.setItem('cobro_index', (index+1).toString());
      actualizarEstadoCobro();
      return;
    }
    const mensaje = encodeURIComponent('Paguen pues, o le clavamos rezagado');
    const url = `https://wa.me/${telefonoForm}?text=${mensaje}`;
    // Abrir en nueva pestaña para que el usuario pueda volver al sistema
    window.open(url, '_blank');
    // Avanzar el índice para la próxima vez que regrese
    localStorage.setItem('cobro_index', (index+1).toString());
    actualizarEstadoCobro();
  }

  function resetearColaCobro() {
    localStorage.setItem('cobro_index', '0');
    actualizarEstadoCobro();
  }

  // Inicializar botones cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    const btnCobro = document.getElementById('btn-enviar-cobro');
    const btnReset = document.getElementById('btn-reset-cobro');
    if (btnCobro) btnCobro.addEventListener('click', enviarSiguienteCobro);
    if (btnReset) btnReset.addEventListener('click', () => {
      if (confirm('¿Reiniciar la secuencia de cobros?')) resetearColaCobro();
    });
    // Inicializar estado
    if (!localStorage.getItem('cobro_index')) localStorage.setItem('cobro_index', '0');
    actualizarEstadoCobro();
    // Reactualizar estado cuando cambien los tickets (escuchar storage por cambios remotos)
    window.addEventListener('storage', (e) => {
      if (e.key === 'tickets') actualizarEstadoCobro();
      if (e.key === 'cobro_index') actualizarEstadoCobro();
    });
  });
})();
