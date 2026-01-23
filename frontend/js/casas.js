

fetch(`${API_URL}/casas`)
  .then(res => res.json())
  .then(casas => {
    const div = document.getElementById('casas');
    const usuario = getUsuario();

    casas.forEach(casa => {
      const card = document.createElement('div');
      card.className = 'casa';

      let galeria = '';

if (casa.imagenes && casa.imagenes.length > 0) {
  casa.imagenes.forEach(img => {
    galeria += `<img src="http://localhost:3000/img/${img}" class="img-casa">
`;

  });
} else {
  galeria = `<img src="http://localhost:3000/img/sin-imagen.jpg" class="img-casa">
`;

}

card.innerHTML = `
  <div class="galeria">
    ${galeria}
  </div>

  <h3>${casa.titulo}</h3>
  <p><strong>Descripción:</strong> ${casa.descripcion}</p>
  <p><strong>Precio:</strong> $${casa.precio}</p>
  <p><strong>Sector:</strong> ${casa.sector}</p>
  <p><strong>Estado:</strong> ${casa.estado}</p>
`;

      if (usuario) {
  const favBtn = document.createElement('button');
  favBtn.textContent = '⭐ Agregar a Favoritos';
  favBtn.onclick = () => agregarFavorito(usuario.id_usuario, casa.id_casa);

  const contactoBtn = document.createElement('button');
  contactoBtn.textContent = '📩 Solicitud de contacto';
  contactoBtn.onclick = () => solicitarContacto(usuario.id_usuario, casa.id_casa);

  card.appendChild(favBtn);
  card.appendChild(contactoBtn);
}

      div.appendChild(card);
    });
  });

function agregarFavorito(id_usuario, id_casa) {
  fetch(`${API_URL}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_usuario, id_casa })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
}

function solicitarContacto(id_usuario, id_casa) {
  const mensaje = prompt('Ingrese su mensaje de contacto:');

  if (!mensaje) return;

  fetch(`${API_URL}/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_usuario, id_casa, mensaje })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
}


