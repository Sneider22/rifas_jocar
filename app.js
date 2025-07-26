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
  updatePanelSuperior();
  mostrarSeleccion();

  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navList = document.getElementById('nav-list');
  const menuOverlay = document.getElementById('menu-overlay');

  function closeMenu() {
    navList.classList.remove('open');
    menuOverlay.classList.remove('active');
    hamburgerMenu.classList.remove('active');
    // Permitir scroll en el body
    document.body.style.overflow = '';
  }
  
  function openMenu() {
    navList.classList.add('open');
    menuOverlay.classList.add('active');
    hamburgerMenu.classList.add('active');
    // Prevenir scroll en el body cuando el menú está abierto
    document.body.style.overflow = 'hidden';
  }
  
  hamburgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navList.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  menuOverlay.addEventListener('click', closeMenu);
  
  // Cerrar menú al seleccionar opción
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Pequeño delay para que se vea la selección antes de cerrar
      setTimeout(() => {
        closeMenu();
      }, 150);
    });
  });
  
  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      closeMenu();
    }
  });
  
  // Prevenir que el click en el menú lo cierre
  navList.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}); 