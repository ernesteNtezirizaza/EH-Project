import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Define interface for API response
interface VerificationResponse {
  message: string;
}

// Define interface for route params
interface VerificationParams extends Record<string, string> {
  token: string;
}

const UserVerificationPage: React.FC = () => {
  const { token } = useParams<VerificationParams>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async (): Promise<void> => {
      if (!token) {
        setError("Token not provided.");
        setLoading(false);
        return;
      }

      try {
        const res: AxiosResponse<VerificationResponse> = await axios.get(`${API_BASE_URL}/api/v1/auth/verify/${token}`);
        const data = res.data;

        if (res.status === 201) {
          setSuccessMessage(data.message);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Error verifying user.");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Account Verification</h1>
          <div className="mt-2 h-1 w-16 bg-blue-500 mx-auto rounded"></div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Verifying your account...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Verification Failed</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && !loading && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Verification Successful</h3>
                <p className="mt-2 text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && !loading && (
          <div className="text-center mt-6">
            <Link to="/login">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                Continue to Login
              </button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              You will be redirected to the login page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerificationPage;