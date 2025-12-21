import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Label from '../ui/Label';
import { AuthAPI } from '../../api/AuthAPI';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === '' || password === '') return setError('Email and Password are required');
    await AuthAPI.signInWithEmail(email, password)
      .then(() => {
        // Navigate to home page on successful login
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setError('Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background-primary">
      <div className="bg-background-secondary p-xl rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-lg text-center">Login</h1>
        {error && <p className="text-red-500 mb-md text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div className="flex flex-col gap-sm">
            <Label htmlFor={'login-id'} labelText={'Email'} />
            <input
              type="email"
              name="login-id"
              id="login-id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-sm rounded-lg border border-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-sm">
            <Label htmlFor={'login-password'} labelText={'Password'} />
            <input
              type={'password'}
              name={'login-password'}
              id={'login-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-sm rounded-lg border border-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>

          <div className="mt-md">
            <button
              type={'submit'}
              className="w-full bg-accent-primary text-background-primary font-semibold text-lg py-md px-xl rounded-xl hover:bg-opacity-80 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
