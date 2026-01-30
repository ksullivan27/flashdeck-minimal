import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
