const contenido = document.getElementById('contenido');

/* =========================
   USUARIOS
========================= */
function cargarUsuarios() {
  fetch(`${API_URL}/admin/usuarios`)
    .then(res => res.json())
    .then(usuarios => {
      contenido.innerHTML = '<h2>Usuarios</h2>';
      usuarios.forEach(u => {
        contenido.innerHTML += `
          <div class="casa">
            <p>${u.nombre} - ${u.correo}</p>
            <button onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
          </div>
        `;
      });
    });
}

function eliminarUsuario(id) {
  if (!confirm('¿Desea eliminar este usuario?')) return;

  fetch(`${API_URL}/admin/usuarios/${id}/eliminar`, {
    method: 'PUT'
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje); // "Usuario eliminado correctamente"
      cargarUsuarios();   // refresca lista
    })
    .catch(err => {
      console.error(err);
      alert('Error al eliminar usuario');
    });
}




/* =========================
   PROPIEDADES
========================= */
function cargarPropiedades() {
  fetch(`${API_URL}/admin/propiedades`)
    .then(res => res.json())
    .then(props => {
      contenido.innerHTML = '<h2>Propiedades</h2>';

      props.forEach(p => {
        contenido.innerHTML += `
          <div class="casa">
            <p><strong>${p.titulo}</strong> - $${p.precio}</p>

            <button onclick="editarPropiedad(${p.id_casa})">Editar</button>
            <button onclick="eliminarPropiedad(${p.id_casa})">Eliminar</button>

            <div class="upload-imagenes">
              <input type="file" multiple accept="image/*" id="imagenes-${p.id_casa}">
              <button onclick="subirImagenes(${p.id_casa})">
                Subir imágenes
              </button>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      contenido.innerHTML = '<p>Error al cargar propiedades.</p>';
    });
}


function formAgregarPropiedad() {
  contenido.innerHTML = `
    <h2>Nueva propiedad</h2>
    <input id="titulo" placeholder="Título">
    <input id="precio" placeholder="Precio">
    <input id="sector" placeholder="Sector">
    <input id="estado" placeholder="Estado">
    <textarea id="descripcion" placeholder="Descripción de la propiedad"></textarea>
    <button onclick="guardarPropiedad()">Guardar</button>
  `;
}

function guardarPropiedad() {
  fetch(`${API_URL}/admin/propiedades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: titulo.value,
      descripcion: descripcion.value,
      precio: precio.value,
      sector: sector.value,
      estado: estado.value
    })
  }).then(res => res.json())
.then(data => {
  alert(
    'Propiedad creada correctamente.\n' +
    'Ahora puedes subir imágenes desde el listado de propiedades.'
  );
  cargarPropiedades();
});

}

function eliminarPropiedad(id) {
  if (!confirm('¿Desea eliminar esta propiedad?')) return;

  fetch(`${API_URL}/admin/propiedades/${id}/eliminar`, {
    method: 'PUT'
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje); // "Propiedad eliminada correctamente"
      cargarPropiedades(); // refresca lista
    })
    .catch(err => {
      console.error(err);
      alert('Error al eliminar propiedad');
    });
}



/* =========================
   SOLICITUDES
========================= */
function cargarSolicitudes() {
  fetch(`${API_URL}/admin/solicitudes`)
    .then(res => res.json())
    .then(solicitudes => {
      contenido.innerHTML = '<h2>Solicitudes de contacto</h2>';

      if (solicitudes.length === 0) {
        contenido.innerHTML += '<p>No hay solicitudes.</p>';
        return;
      }

      solicitudes.forEach(s => {
        contenido.innerHTML += `
          <div class="casa">
            <p><strong>Usuario:</strong> ${s.nombre_usuario}</p>
            <p><strong>Propiedad:</strong> ${s.titulo_casa}</p>
            <p><strong>Mensaje:</strong> ${s.mensaje}</p>
            <p><strong>Estado:</strong> ${s.estado}</p>
            ${
              s.estado === 'Pendiente'
                ? `<button onclick="resolverSolicitud(${s.id_solicitud})">
                     Marcar como resuelto
                   </button>`
                : ''
            }
          </div>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      contenido.innerHTML = '<p>Error al cargar solicitudes.</p>';
    });
}


function resolverSolicitud(id) {
  fetch(`${API_URL}/admin/solicitudes/${id}`, { method: 'PUT' })
    .then(res => res.json())
    .then(() => cargarSolicitudes());
}

window.subirImagenes = function (idCasa) {
  const input = document.getElementById(`imagenes-${idCasa}`);

  if (!input || !input.files.length) {
    alert('Selecciona al menos una imagen');
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < input.files.length; i++) {
    formData.append('imagenes', input.files[i]);
  }

  fetch(`${API_URL}/admin/propiedades/${idCasa}/imagenes`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      input.value = '';
    })
    .catch(err => {
      console.error(err);
      alert('Error al subir imágenes');
    });
};

function editarPropiedad(id) {
  fetch(`${API_URL}/admin/propiedades`)
    .then(res => res.json())
    .then(propiedades => {
      const propiedad = propiedades.find(p => p.id_casa === id);

      if (!propiedad) {
        alert('Propiedad no encontrada');
        return;
      }

      contenido.innerHTML = `
        <h2>Editar propiedad</h2>

        <div class="form-grid">
         <input id="titulo" value="${propiedad.titulo}">
        <input id="precio" value="${propiedad.precio}">
        <input id="sector" value="${propiedad.sector}">
        <input id="estado" value="${propiedad.estado}">
        <textarea id="descripcion">${propiedad.descripcion}</textarea>
        </div>
        
        <h3>Imágenes actuales</h3>
        <div class="imagenes-admin" id="imagenesActuales"></div>

        <h3>Agregar nuevas imágenes</h3>
        <input type="file" multiple accept="image/*" id="imagenes-${id}">
        <button onclick="subirImagenes(${id})">Subir imágenes</button>

        <br><br>
        <button onclick="guardarEdicion(${id})">Guardar cambios</button>
        <button onclick="cargarPropiedades()">Cancelar</button>
      `;

      
      cargarImagenesCasa(id);
    });
}


function cargarImagenesCasa(idCasa) {
  fetch(`${API_URL}/casas/${idCasa}`)
    .then(res => res.json())
    .then(casa => {
      const cont = document.getElementById('imagenesActuales');
      cont.innerHTML = '';

      if (!casa.imagenes || casa.imagenes.length === 0) {
        cont.innerHTML = '<p>No hay imágenes registradas.</p>';
        return;
      }

      casa.imagenes.forEach(img => {
        cont.innerHTML += `
          <img src="img/${img}" class="img-admin">
        `;
      });
    });
}


function guardarEdicion(id) {
  fetch(`${API_URL}/admin/propiedades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: titulo.value,
      descripcion: descripcion.value,
      precio: parseInt(precio.value.replace(/\./g, '')),
      sector: sector.value,
      estado: estado.value
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje || 'Propiedad actualizada');
      cargarPropiedades();
    })
    .catch(err => {
      console.error(err);
      alert('Error al actualizar propiedad');
    });
}


/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem('usuario');
  location.href = 'index.html';
}

