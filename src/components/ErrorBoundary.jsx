import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-4">
                    {error.message || 'An unexpected error occurred. Please try again later.'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
};

export default ErrorBoundary;
