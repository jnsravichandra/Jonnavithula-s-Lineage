import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../../api/AuthAPI';

function Logout() {
  const [message, setMessage] = useState('Logging out...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await AuthAPI.signOut();
        setMessage('You have been successfully logged out.');
      } catch (err) {
        console.error(err);
        setMessage('Logout failed. Please try again.');
      } finally {
        setTimeout(() => {
          navigate('/');
        }, 2000); // Wait for 1 second before redirecting
      }
    };

    handleLogout();
    
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background-primary">
      <div className="bg-background-secondary p-xl rounded-2xl shadow-lg w-full max-w-3xl text-center">
        <h1 className="text-2xl font-heading font-bold text-text-primary">{message}</h1>
      </div>
    </div>
  );
}

export default Logout;