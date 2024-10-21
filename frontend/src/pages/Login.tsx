import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Para redireccionar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email: email,
        password: password,
      });
      console.log('Respuesta del backend:', response.data);
      // Obtener el token y el rol del usuario de la respuesta
      const { token, user } = response.data;
      const { permisos } = user;
      // Almacenar el token en localStorage
      localStorage.setItem('token', token);

      
      // Redirigir según el rol
      if (permisos === 'admin') {
        navigate('/admin');
      } else if (permisos === 'user') {
        navigate('/user');
      } else if (permisos === 'seller') {
        navigate('/seller');
      } else {
        setError('Rol no válido');
      }
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary mt-3">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
