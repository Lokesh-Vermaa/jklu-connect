import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function MentorLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
}
