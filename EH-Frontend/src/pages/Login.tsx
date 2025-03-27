import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface LoginFormValues {
  email: string;
  password: string;
  submit?: string | null;
}

// Custom toast styles to match the application's design
const toastStyles = {
  success: {
    style: {
      background: '#f0f9ff',
      borderLeft: '4px solid #3b82f6',
      color: '#1e3a8a',
      fontFamily: 'Poppins, sans-serif',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    progressStyle: {
      background: '#3b82f6',
    },
    icon: '👍',
  },
  error: {
    style: {
      background: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      color: '#7f1d1d',
      fontFamily: 'Poppins, sans-serif',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    progressStyle: {
      background: '#ef4444',
    },
    icon: '⚠️',
  }
};

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, isAuthenticated, userData } = useAuth();

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};
    
    if (!formValues.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formValues.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Custom toast notification functions
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      autoClose: 3000,
      style: toastStyles.success.style,
      icon: () => <CheckCircle className="w-5 h-5 text-blue-500" />
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      autoClose: 3000,
      style: toastStyles.error.style,
      icon: () => <AlertCircle className="w-5 h-5 text-red-500" />
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues),
        });

        const result = await response.json();

        if (response.ok) {
          // Format the user data to include the role information
          const userData = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            name: `${result.firstName} ${result.lastName}`.trim(),
            username: result.username,
            email: result.email,
            role: result.roleName,
            image: result.image,
            verifiedAt: result.verifiedAt,
            isVerified: result.isVerified,
            message: result.message,
          };

          // Pass the formatted user data to the login function
          showSuccessToast(result.message || 'Login successful!');
          login(result.accessToken, userData);
        } else {
          showErrorToast(result.message || 'Login failed!');
        }
      } catch (error) {
        console.error('Login error:', error);
        showErrorToast('An unexpected error occurred. Please try again.');
        setErrors({ ...errors, submit: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If authenticated, redirect to the appropriate dashboard based on role
  if (isAuthenticated && userData) {
    const role = userData.role.toLowerCase();
    
    if (role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (role === 'student') {
      return <Navigate to="/dashboard/student" replace />;
    } else if (role === 'mentor') {
      return <Navigate to="/dashboard/mentor" replace />;
    } else {
      // If the role is not recognized, redirect to a general dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-poppins">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-md m-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter email address"
              value={formValues.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter password"
                value={formValues.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {errors.submit && <p className="mt-1 mb-3 text-sm text-red-500">{errors.submit}</p>}

          <button
            type="submit"
            className={`w-full py-3 text-white ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} rounded-md`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-500 hover:text-blue-600 text-sm">
              Don't have an account? Register
            </Link>
          </div>
        </form>
        
        {/* Custom styled toast container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="font-poppins"
          toastClassName="rounded-md"
        />
      </div>
    </div>
  );
};

export default Login;