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
      updatePanelInferior();
    });
    grid.appendChild(div);
  }

  function updatePanelInferior() {
    contadorSeleccionados.textContent = seleccionTemp.length;
    btnContinuar.disabled = seleccionTemp.length === 0;
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
    updatePanelInferior();
  });

  const navSeleccion = document.getElementById('nav-seleccion');
  const navTickets = document.getElementById('nav-tickets');
  const paginaSeleccion = document.getElementById('pagina-seleccion');
  const paginaTickets = document.getElementById('pagina-tickets');
  const busquedaNombre = document.getElementById('busqueda-nombre');
  const btnBuscarNombre = document.getElementById('btn-buscar-nombre');
  const busquedaNumero = document.getElementById('busqueda-numero');
  const btnBuscarNumero = document.getElementById('btn-buscar-numero');

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
    renderTicketsFiltro();
  }
  navSeleccion.addEventListener('click', (e) => { e.preventDefault(); mostrarSeleccion(); });
  navTickets.addEventListener('click', (e) => { e.preventDefault(); mostrarTickets(); });

  function renderTicketsFiltro(nombreFiltro = '', numeroFiltro = '') {
    ticketsList.innerHTML = '';
    let entries = Object.entries(tickets);
    if (nombreFiltro) {
      const filtroLower = nombreFiltro.trim().toLowerCase();
      entries = entries.filter(([, data]) => data.nombre.toLowerCase().includes(filtroLower));
    }
    if (numeroFiltro) {
      const numFiltro = numeroFiltro.trim().padStart(3, '0');
      entries = entries.filter(([num]) => num === numFiltro);
    }
    if (entries.length === 0) {
      ticketsList.innerHTML = '<div style="color:#888;">No se encontraron tickets.</div>';
      return;
    }
    entries.forEach(([num, data]) => {
      const item = document.createElement('div');
      item.className = 'ticket-item';
      item.innerHTML = `<strong>#${num}</strong> - ${data.nombre} | Cédula: ${data.cedula} | Tel: ${data.telefono}`;
      ticketsList.appendChild(item);
    });
  }

  btnBuscarNombre.addEventListener('click', () => {
    renderTicketsFiltro(busquedaNombre.value, busquedaNumero.value);
  });
  btnBuscarNumero.addEventListener('click', () => {
    renderTicketsFiltro(busquedaNombre.value, busquedaNumero.value);
  });
  busquedaNombre.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderTicketsFiltro(busquedaNombre.value, busquedaNumero.value);
    if (!busquedaNombre.value && !busquedaNumero.value) renderTicketsFiltro();
  });
  busquedaNumero.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderTicketsFiltro(busquedaNombre.value, busquedaNumero.value);
    if (!busquedaNombre.value && !busquedaNumero.value) renderTicketsFiltro();
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
  renderTickets();

  cerrarModal.addEventListener('click', () => {
    modal.classList.add('oculto');
    seleccionTemp = [];
    clearSeleccionados();
    updatePanelInferior();
  });
  cancelarBtn.addEventListener('click', () => {
    modal.classList.add('oculto');
    seleccionTemp = [];
    clearSeleccionados();
    updatePanelInferior();
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
    renderTicketsFiltro();
    seleccionTemp = [];
    modal.classList.add('oculto');
    form.reset();
    updatePanelInferior();
  });
  updatePanelInferior();
  mostrarSeleccion();

  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navList = document.getElementById('nav-list');
  const menuOverlay = document.getElementById('menu-overlay');

  function closeMenu() {
    navList.classList.remove('open');
    menuOverlay.classList.remove('active');
  }
  function openMenu() {
    navList.classList.add('open');
    menuOverlay.classList.add('active');
  }
  hamburgerMenu.addEventListener('click', () => {
    if (navList.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  menuOverlay.addEventListener('click', closeMenu);
  // Cerrar menú al seleccionar opción
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}); 