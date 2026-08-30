// src/components/AdminLayout.jsx
import React from 'react';
import AdminBar from './AdminBar';

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminBar>
        {children}
      </AdminBar>
    </>
  );
};

export default AdminLayout;