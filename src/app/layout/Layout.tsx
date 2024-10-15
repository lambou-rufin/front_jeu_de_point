import React from 'react';
import { LayoutProps } from '../../interfaces/LayoutProps';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
