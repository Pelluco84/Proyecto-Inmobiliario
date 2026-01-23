const usuario = getUsuario();

fetch(`${API_URL}/favoritos/${usuario.id_usuario}`)
  .then(res => res.json())
  .then(casas => {
    const div = document.getElementById('lista');
    casas.forEach(c => {
      div.innerHTML += `<p>${c.titulo} - $${c.precio}</p>`;
    });
  });
