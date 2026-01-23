function login() {
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena })
  })
  .then(res => res.json())
  .then(data => {
    if (data.id_usuario) {
      localStorage.setItem('usuario', JSON.stringify(data));
      if (data.rol === 'Administrador') {
        location.href = 'admin.html';
      } else {
        location.href = 'index.html';
      }
    } else {
  document.getElementById('errorLogin').innerText = data.mensaje;
  document.getElementById('recuperar').style.display = 'block';
}

  });
}

function registrar() {
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  if (!nombre || !correo || !contrasena) {
    alert('Completa todos los campos');
    return;
  }

  fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena })
  })
    .then(res => res.json())
    .then(data => {
  if (data.mensaje === 'Usuario registrado correctamente') {
    alert(data.mensaje);
    window.location.href = 'index.html';
  } else {
    alert(data.mensaje); // "Correo ya registrado"
  }
    })
    .catch(err => {
      console.error(err);
      alert('Error al registrar usuario');
    });
}

