import { useState } from 'react';
import Button from '../components/ui/Button';
import { UserPlus, Loader2 } from 'lucide-react';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Alert from '../components/ui/Alert';
import { Link, useNavigate } from 'react-router-dom';
// import Select from '../components/ui/Select';
import { API_BASE_URL, handleError, handleSuccess } from '../api';  

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'userType2'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/\S+@\S+\.\S/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
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
      const res = await fetch(`${API_BASE_URL}/auth/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.fullName, // Map fullName to username
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        handleError(data.message || 'Signup failed');
        return;
      }

      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'userType2'
      });
      handleSuccess('Signed up successfully. Please sign in.');
      navigate('/');
    } catch (error) {
      setSubmitError(error.message || 'Signup failed');
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
    // Clear error when user types
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
          <UserPlus className="w-8 h-8 text-blue-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-blue-700">Sign Up</h2>
        </div>

        {submitError && (
          <Alert type="error" message={submitError} className="mb-4" onDismiss={() => setSubmitError(null)} />
        )}

        <div className="mb-4">
          <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Full Name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'}`}
            value={formData.fullName}
            onChange={handleChange}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

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

        <div className="mb-4">
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

        <div className="mb-6">
          <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </Label>
          <select
            id="role"
            name="role"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formData.role}
            onChange={handleChange}
            aria-label="Select Role"
          >
            <option value="admin">Admin</option>
            <option value="userType1">User Type 1</option>
            <option value="userType2">User Type 2</option>
          </select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center gap-2 rounded-lg p-2"
          disabled={isLoading}
          aria-label={isLoading ? "Processing..." : "Sign Up"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Processing...
            </>
          ) : 'Sign Up'}
        </Button>

        <Link to="/" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default Signup;