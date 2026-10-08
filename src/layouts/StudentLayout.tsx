import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_280px] gap-5">
          <div className="hidden md:block">
            <div className="sticky top-24">
              <LeftSidebar />
            </div>
          </div>
          <main className="min-w-0">
            <Outlet />
          </main>
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
