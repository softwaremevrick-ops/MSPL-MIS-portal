import { useContext, useState } from 'react';
import Button from '../components/ui/Button';
import { Lock, Loader2 } from 'lucide-react';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL, handleError, handleSuccess } from '../api';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        handleError(data.message || 'Sign in failed');
        return;
      }

      login(data); // Set user data in context

      handleSuccess('Signed in successfully');

      // Redirect based on user role
      switch (data.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'userType1':
          navigate('/user-type-1');
          break;
        case 'userType2':
          navigate('/user-type-2');
          break;
        default:
          navigate('/dashboard'); // Default redirect if role is not matched
      }
      
      // For demonstration, clear form on success
      setFormData({
        email: '',
        
        password: ''
      });
    } catch (error) {
      setSubmitError(error.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className='flex flex-col justify-center items-center mb-6'>
          <img src="https://www.mevrick.in/assets/MEVRICK%20LOGO-01.png" alt="logo" className='w-32 h-16 mb-2' />
          <h2 className='text-blue-700 font-bold text-4xl'>MIS Portal</h2>
        </div>
        <div className="flex justify-center items-center gap-3 mb-6">
          <Lock className="w-8 h-8 text-blue-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-blue-700">Sign In</h2>
        </div>

        {submitError && (
          <Alert type="error" message={submitError} className="mb-4" onDismiss={() => setSubmitError(null)} />
        )}

        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'}`}
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'}`}
            value={formData.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center gap-2 p-2 rounded-lg"
          disabled={isLoading}
          aria-label={isLoading ? "Signing in..." : "Sign In"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : 'Sign In'}
        </Button>

        <div className="mt-4 text-center">
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;