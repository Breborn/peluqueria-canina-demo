/**
 * HUELLA & BRISA • Spa & Peluquería Canina (V Región, Chile)
 * Calculador interactivo de tarifas por tamaño/manto + Agenda WhatsApp
 * Página creada por Breborn.cl
 */

const WHATSAPP_PHONE = '56956823670';

const SIZE_LABELS = {
  toy: 'Mini / Toy (< 5 kg)',
  mediano: 'Pequeño / Mediano (6–15 kg)',
  grande: 'Grande (16–30 kg)',
  gigante: 'Gigante (> 30 kg)'
};

const COAT_LABELS = {
  corto: 'Pelo Corto / Doble Manto',
  largo: 'Pelo Largo / Rizado'
};

const PACKAGES = [
  {
    id: 'bano_botanico',
    icon: '🫧',
    badge: '',
    name: 'Baño Botánico Express',
    duration: '60 – 75 min',
    features: [
      'Doble lavado con shampoo de avena y manzanilla',
      'Secado tibio silencioso + cepillado completo',
      'Limpieza de oídos, despeje higiénico y corte de uñas',
      'Loción hipoalergénica final'
    ],
    prices: {
      toy: { corto: 14990, largo: 17990 },
      mediano: { corto: 19990, largo: 23990 },
      grande: { corto: 26990, largo: 31990 },
      gigante: { corto: 34990, largo: 39990 }
    }
  },
  {
    id: 'deslanado',
    icon: '✨',
    badge: 'ANTI-PELO',
    name: 'Baño + Deslanado Profundo',
    duration: '75 – 95 min',
    features: [
      'Todo el Baño Botánico Express',
      'Mascarilla soltadora de subpelo en baño tibio',
      'Técnica Carding para retirar hasta 85% pelo muerto',
      'Ideal Golden, Husky, Pug, Pastor y Pomerania'
    ],
    prices: {
      toy: { corto: 18990, largo: 21990 },
      mediano: { corto: 24990, largo: 28990 },
      grande: { corto: 32990, largo: 37990 },
      gigante: { corto: 41990, largo: 46990 }
    }
  },
  {
    id: 'peluqueria_completa',
    icon: '✂️',
    badge: 'MÁS ELEGIDO',
    name: 'Peluquería Completa de Autor',
    duration: '90 – 120 min',
    features: [
      'Corte de raza a tijera o máquina (Teddy / Verano)',
      'Baño nutritivo botánico + acondicionador de karité',
      'Corte y limado de uñas, carita redonda y plantitas',
      'Atención 1 a 1 sin jaulas ni apuros'
    ],
    prices: {
      toy: { corto: 22990, largo: 25990 },
      mediano: { corto: 27990, largo: 31990 },
      grande: { corto: 36990, largo: 41990 },
      gigante: { corto: 46990, largo: 52990 }
    }
  },
  {
    id: 'spa_ozono',
    icon: '🌿',
    badge: 'SPA DERMO',
    name: 'Spa Dermocosmético & Ozono',
    duration: '120 min',
    features: [
      'Peluquería Completa o Deslanado según raza',
      'Baño de microburbujas con ozonoterapia calmante',
      'Hidratación de cojinetes y nariz con manteca natural',
      'Foto recuerdo post-sesión enviada a tu WhatsApp'
    ],
    prices: {
      toy: { corto: 27990, largo: 30990 },
      mediano: { corto: 33990, largo: 37990 },
      grande: { corto: 42990, largo: 47990 },
      gigante: { corto: 52990, largo: 58990 }
    }
  }
];

const EXTRAS = [
  { id: 'unas', icon: '💅', name: 'Limado Suave de Uñas + Bálsamo Patitas', desc: 'Redondea puntas para no rasguñar', price: 4500 },
  { id: 'despeje', icon: '👀', name: 'Despeje Facial, Lagrimal & Higiene', desc: 'Mantiene ojitos y zona sanitaria limpia', price: 4000 },
  { id: 'oidos', icon: '🩺', name: 'Limpieza Botánica de Oídos + Caléndula', desc: 'Ideal orejitas caídas (Cocker, Poodle)', price: 3500 },
  { id: 'ozono', icon: '💧', name: 'Shot de Ozonoterapia Calma Piel', desc: 'Alivia picazón, caspa o piel sensible', price: 7500 },
  { id: 'antipulgas', icon: '🛡️', name: 'Baño Repelente Natural de Neem & Romero', desc: 'Complemento preventivo libre de tóxicos', price: 5500 },
  { id: 'retiro', icon: '🚐', name: 'Retiro y Regreso a Domicilio', desc: 'Viña del Mar, Reñaca & Plan Valparaíso', price: 6000 }
];

const State = {
  size: 'toy',
  coat: 'corto',
  packageId: 'peluqueria_completa',
  selectedExtras: new Set(),
  temperament: 'Tranquilo y sociable'
};

const formatCLP = (val) => '$' + Number(val).toLocaleString('es-CL');

document.addEventListener('DOMContentLoaded', () => {
  initControls();
  initMobileNav();
  renderPackages();
  renderExtras();
  updateSummary();
  document.getElementById('sendWaBookingBtn').addEventListener('click', sendWhatsAppBooking);
});

function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mobileNav');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initControls() {
  document.querySelectorAll('#sizePills .size-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sizePills .size-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      State.size = btn.dataset.size;
      renderPackages();
      updateSummary();
    });
  });

  document.querySelectorAll('#coatToggle .coat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#coatToggle .coat-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      State.coat = btn.dataset.coat;
      renderPackages();
      updateSummary();
    });
  });

  document.querySelectorAll('#temperamentChips .temp-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#temperamentChips .temp-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      State.temperament = btn.dataset.temp;
    });
  });
}

function renderPackages() {
  const grid = document.getElementById('packagesGrid');
  grid.innerHTML = PACKAGES.map((pkg) => {
    const price = pkg.prices[State.size][State.coat];
    const isSel = State.packageId === pkg.id;
    return `
      <article class="pkg-card ${isSel ? 'selected' : ''}" data-pkg="${pkg.id}">
        ${pkg.badge ? `<span class="pkg-badge">${pkg.badge}</span>` : ''}
        <div>
          <div class="pkg-icon">${pkg.icon}</div>
          <h3>${pkg.name}</h3>
          <div class="pkg-duration">⏱️ Duración aprox: ${pkg.duration}</div>
          <div class="pkg-price">${formatCLP(price)}</div>
          <ul class="pkg-list">
            ${pkg.features.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <button type="button" class="pkg-select-btn" onclick="selectPackage('${pkg.id}')">
          ${isSel ? '✓ Servicio Seleccionado' : 'Seleccionar para Reserva'}
        </button>
      </article>
    `;
  }).join('');
}

window.selectPackage = function (pkgId) {
  State.packageId = pkgId;
  renderPackages();
  updateSummary();
  const pkg = PACKAGES.find((p) => p.id === pkgId);
  showToast(`✓ Seleccionado: ${pkg.name}`);
};

function renderExtras() {
  const grid = document.getElementById('extrasGrid');
  grid.innerHTML = EXTRAS.map((ex) => {
    const active = State.selectedExtras.has(ex.id);
    return `
      <button type="button" class="extra-card ${active ? 'active' : ''}" onclick="toggleExtra('${ex.id}')">
        <div class="extra-info">
          <span class="extra-emoji">${ex.icon}</span>
          <div>
            <strong>${ex.name}</strong>
            <small>${ex.desc}</small>
          </div>
        </div>
        <div class="extra-right">
          <span class="extra-price">+${formatCLP(ex.price)}</span>
          <span class="extra-toggle-badge">${active ? '✓ Incluido' : '+ Sumar'}</span>
        </div>
      </button>
    `;
  }).join('');
}

window.toggleExtra = function (exId) {
  if (State.selectedExtras.has(exId)) {
    State.selectedExtras.delete(exId);
  } else {
    State.selectedExtras.add(exId);
  }
  renderExtras();
  updateSummary();
};

function updateSummary() {
  const pkg = PACKAGES.find((p) => p.id === State.packageId);
  const basePrice = pkg.prices[State.size][State.coat];

  let extrasTotal = 0;
  const extrasHtml = [];
  State.selectedExtras.forEach((id) => {
    const ex = EXTRAS.find((e) => e.id === id);
    if (ex) {
      extrasTotal += ex.price;
      extrasHtml.push(`<div class="ticket-extra-row"><span>+ ${ex.name}</span><span>${formatCLP(ex.price)}</span></div>`);
    }
  });

  const grandTotal = basePrice + extrasTotal;

  document.getElementById('summaryProfile').textContent = `${SIZE_LABELS[State.size]} • ${COAT_LABELS[State.coat]}`;
  document.getElementById('summaryPackage').textContent = pkg.name;
  document.getElementById('summaryBasePrice').textContent = formatCLP(basePrice);
  document.getElementById('summaryExtrasList').innerHTML = extrasHtml.length
    ? extrasHtml.join('')
    : '<span class="ticket-extra-empty">Sin extras adicionales seleccionados</span>';
  document.getElementById('summaryGrandTotal').textContent = formatCLP(grandTotal);
  document.getElementById('navSummaryTotal').textContent = formatCLP(grandTotal);
}

function sendWhatsAppBooking() {
  const petName = document.getElementById('petName').value.trim();
  const petBreed = document.getElementById('petBreed').value.trim();
  if (!petName || !petBreed) {
    showToast('⚠️ Escribe el nombre y raza de tu perrito arriba');
    document.getElementById(petName ? 'petBreed' : 'petName').focus();
    return;
  }

  const ownerName = document.getElementById('ownerName').value.trim() || 'No indicado';
  const branch = document.getElementById('branchSelect').value;
  const day = document.getElementById('daySelect').value;
  const time = document.getElementById('timeSelect').value;
  const notes = document.getElementById('bookingNotes').value.trim();

  const pkg = PACKAGES.find((p) => p.id === State.packageId);
  const basePrice = pkg.prices[State.size][State.coat];
  let extrasTotal = 0;
  const extrasText = [];
  State.selectedExtras.forEach((id) => {
    const ex = EXTRAS.find((e) => e.id === id);
    if (ex) {
      extrasTotal += ex.price;
      extrasText.push(`  • ${ex.name} (${formatCLP(ex.price)})`);
    }
  });
  const total = basePrice + extrasTotal;

  const lines = [
    `¡Hola! 👋 Quiero agendar una hora en *HUELLA & BRISA*:`,
    ``,
    `🐶 *Perrito:* ${petName} (${petBreed})`,
    `📏 *Tamaño y Manto:* ${SIZE_LABELS[State.size]} • ${COAT_LABELS[State.coat]}`,
    `✂️ *Servicio:* ${pkg.name} (${formatCLP(basePrice)})`,
    ...(extrasText.length ? [`🌿 *Extras:*`, ...extrasText] : []),
    `💰 *Total Referencial:* ${formatCLP(total)}`,
    ``,
    `📍 *Modalidad / Sede:* ${branch}`,
    `📅 *Día y Horario:* ${day} • ${time}`,
    `💛 *Comportamiento:* ${State.temperament}`,
    `👤 *Tutor/a:* ${ownerName}`,
    ...(notes ? [`📝 *Notas:* ${notes}`] : []),
    ``,
    `¿Tienen disponibilidad en ese bloque? ¡Gracias!`
  ];

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
