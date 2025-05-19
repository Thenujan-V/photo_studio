import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 border rounded shadow bg-white">
        <h1 className="display-4 text-danger fw-bold">401</h1>
        <h3 className="mb-3">Unauthorized Access</h3>
        <p className="text-muted mb-4">
          You do not have permission to view this page. Please login or contact the administrator.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
