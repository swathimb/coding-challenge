import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import styles from './App.scss';
import { useMst } from '../stores/StoreProvider.js';
import Planet from './routes/Planet.jsx';
import Planets from './routes/Planets.jsx';
import Resident from './routes/Resident.jsx';
import People from './routes/People.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import TopNav from './components/TopNav.jsx';

const App = () => {
  
  return (
    <div className="app">
      <CustomCursor />
      <TopNav />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Navigate to="/planets" replace />} />
        <Route path="/people" element={<People />} />
        <Route path="/person/:residentId" element={<Resident />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/planets/:planetId" element={<Planet />} />
        <Route path="/planets/:planetId/residents/:residentId" element={<Resident />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
};

export default observer(App);
