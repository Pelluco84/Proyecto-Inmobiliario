const API_URL = 'https://backend-inmobiliaria-33m5.onrender.com/api';


function getUsuario() {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
}

