<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sistema Inmobiliario</title>
</head>
<body>

<h1>Sistema Inmobiliario</h1>

<h2>Filtros</h2>
<input type="text" id="sector" placeholder="Sector">
<select id="estado">
  <option value="">Todos</option>
  <option value="Venta">Venta</option>
  <option value="Arriendo">Arriendo</option>
</select>
<input type="number" id="precio" placeholder="Precio máximo">
<button onclick="cargarCasas()">Buscar</button>

<ul id="listaCasas"></ul>

<hr>

<h2>Login</h2>
<input type="email" id="correo" placeholder="Correo">
<input type="password" id="contrasena" placeholder="Contraseña">
<button onclick="login()">Iniciar sesión</button>
<p id="loginMsg"></p>

<hr>

<h2>Solicitud de contacto</h2>
<input type="text" id="mensaje" placeholder="Mensaje">
<input type="number" id="id_usuario" placeholder="ID Usuario">
<input type="number" id="id_casa" placeholder="ID Casa">
<button onclick="enviarSolicitud()">Enviar</button>
<p id="solMsg"></p>

<script>
function cargarCasas() {
  const sector = document.getElementById('sector').value;
  const estado = document.getElementById('estado').value;
  const precio = document.getElementById('precio').value;

  fetch(`http://localhost:3000/casas?sector=${sector}&estado=${estado}&precio=${precio}`)
    .then(r => r.json())
    .then(data => {
      const ul = document.getElementById('listaCasas');
      ul.innerHTML = '';
      data.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.titulo} - ${c.sector} - $${c.precio}`;
        ul.appendChild(li);
      });
    });
}

function login() {
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      correo: correo.value,
      contrasena: contrasena.value
    })
  })
  .then(r => r.json())
  .then(d => loginMsg.innerText = d.mensaje);
}

function enviarSolicitud() {
  fetch('http://localhost:3000/solicitud', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      mensaje: mensaje.value,
      id_usuario: id_usuario.value,
      id_casa: id_casa.value
    })
  })
  .then(r => r.json())
  .then(d => solMsg.innerText = d.mensaje);
}
</script>

</body>
</html>
