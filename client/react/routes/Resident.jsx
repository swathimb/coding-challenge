import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './resident.scss';
import { useMst } from '../../stores/StoreProvider.js';
import PageTitle from '../components/PageTitle.jsx';
import SubTitle from '../components/SubTitle.jsx';

const Resident = ({section}) => {
  const urlParams = useParams();
  const { getResident, getPerson } = useMst(store => ({
    getResident: store.getResident,
    getPerson: store.getPerson
  }));

  const resident = section === 'planet' ?  getResident(urlParams.residentId) : getPerson(urlParams.residentId);
  const planet = resident ? resident.homeworld : {};

  if (!resident) {
    return <div>404</div>;
  }

  const displayKeys = Object.keys(resident).filter(key => (
    !(resident[key] instanceof Array)
    && !['homeworld', 'id', 'name', 'url', 'created', 'edited'].includes(key)
  ));

  return (
    <div className="resident">
      <PageTitle>{resident.name}</PageTitle>

      <SubTitle>Details</SubTitle>
      <div className="details">
        {displayKeys.map(key => (
          <div key={key} className="detailItem">
            <div className="detailName">{key}</div>
            <div className="detailValue">{resident[key]}</div>
          </div>
        ))}
        <div className="detailItem">
          <div className="detailName">homeworld</div>
          <div className="detailValue">{planet && planet.name || 'unknown'}</div>
        </div>
      </div>
    </div>
  );
};

export default Resident;
