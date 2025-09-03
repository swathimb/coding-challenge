import React, {useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './planet.scss';
import { useMst } from '../../stores/StoreProvider.js';
import PageTitle from '../components/PageTitle.jsx';
import { getSnapshot } from 'mobx-state-tree';
import ResidentsList from '../components/ResidentsList.jsx';
import SubTitle from '../components/SubTitle.jsx';

const Planet = () => {
  const urlParams = useParams();
  const { getPlanet } = useMst(store => ({
    getPlanet: store.getPlanet,
  }));

  const planet = getPlanet(urlParams.planetId);

  if (!planet) {
    return <div>404</div>;
  }

  const displayKeys = Object.keys(planet).filter(key => (
    !(planet[key] instanceof Array)
    && !['id', 'name', 'url', 'created', 'edited'].includes(key)
  ));
  return (
    <div className="planet">
      <PageTitle>{planet.name}</PageTitle>

      <SubTitle>Details</SubTitle>
      <div className="details">
        {displayKeys.map(key => (
          <div key={key} className="detailItem">
            <div className="detailName">{key}</div>
            <div className="detailValue">{planet[key]}</div>
          </div>
        ))}
      </div>

      <ResidentsList residents={planet.residents}/>
    </div>
  );
};

export default Planet;
