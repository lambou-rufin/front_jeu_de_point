import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../shared/service/AuthService';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const response = async () => {
      try {
        await AuthService.clearToken(); 
        navigate('/login'); 
      } catch (error) {
        console.error('Erreur lors du logout:', error);
      }
    };

    response();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;