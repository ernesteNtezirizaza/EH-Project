import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface SignupFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    roleId: string;
}

interface FormErrors extends Partial<SignupFormValues> {
    submit?: string;
}

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<SignupFormValues>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        roleId: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [roles, setRoles] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState<{
        level: number;
        label: string;
        color: string;
    }>({
        level: 0,
        label: '',
        color: '',
    });

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }

        // // Check password strength if password field is changed
        // if (name === 'password') {
        //     checkPasswordStrength(value);
        // }
    };

    const checkPasswordStrength = (password: string): void => {
        // Simple password strength indicator
        let level = 0;
        let label = 'Poor';
        let color = 'bg-red-500';

        if (password.length > 0) {
            level = 1; // Poor by default if there's any character
        }

        if (password.length >= 6) {
            level = 2;
            label = 'Weak';
            color = 'bg-orange-500';
        }

        if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password)) {
            level = 3;
            label = 'Medium';
            color = 'bg-yellow-500';
        }

        if (
            password.length >= 10 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password)
        ) {
            level = 4;
            label = 'Strong';
            color = 'bg-green-500';
        }

        if (
            password.length >= 12 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        ) {
            level = 5;
            label = 'Very Strong';
            color = 'bg-blue-500';
        }

        setPasswordStrength({ level, label, color });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formValues.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        }

        if (!formValues.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        }

        if (!formValues.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formValues.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!formValues.password) {
            newErrors.password = 'Password is required';
        } else if (formValues.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formValues.roleId) {
            newErrors.roleId = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/roles`);
                setRoles(response.data.roles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (validateForm()) {
            setIsSubmitting(true);
            const values = { ...formValues };
    
            try {
                const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, values);
                
                if (response.data.success) {
                    toast.success(response.data.message || "Registration successful!");
                } else {
                    toast.error(response.data.message || "Something went wrong. Please try again.");
                }
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.message || "Something went wrong. Please try again.";
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.error("Please fill in all required fields.");
        }
    };    

    useEffect(() => {
        // Initialize password strength
        checkPasswordStrength('');
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-poppins">
            <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-md m-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Sign up</h1>
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 text-sm mt-1 md:mt-0">
                        Already have an account? Login
                    </Link>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
                                First Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter first name"
                                value={formValues.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                                Last Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter last name"
                                value={formValues.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                            Username<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter username"
                            value={formValues.username}
                            onChange={handleChange}
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                           Email Address<span className="text-red-500">*</span> 
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter email"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter password"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}

                        {/* <div className="mt-2">
                            <div className={`w-full h-1 rounded-full ${passwordStrength.color}`}></div>
                            <p className="mt-1 text-xs">{passwordStrength.label}</p>
                        </div> */}
                    </div>


                    <div className="mb-4">
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
                            Role<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="roleId"
                            name="roleId"
                            className={`w-full px-3 py-2 border ${errors.roleId ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formValues.roleId}
                            onChange={handleChange}
                        >
                            <option value="">Select a role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && (
                            <p className="mt-1 text-xs text-red-500">{errors.roleId}</p>
                        )}
                    </div>

                    {errors.submit && (
                        <p className="mt-2 text-xs text-red-500">{errors.submit}</p>
                    )}

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${
                                isSubmitting 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
};

export default Register;