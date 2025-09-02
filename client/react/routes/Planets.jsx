import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { getSnapshot } from 'mobx-state-tree';


import { useMst } from '../../stores/StoreProvider.js';
import PageTitle from '../components/PageTitle.jsx';
import Pagination from '../components/Pagination.jsx';
import styles from './planets.scss';

const Planets = () => {
  const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
  
  const { planets, getFilteredPlanets, fetchPlanets, planetsCount, planetCurrentPage } = useMst(store => ({
    planets: store.planets,
    getFilteredPlanets: store.getFilteredPlanets,
    fetchPlanets: store.fetchPlanets,
    planetsCount: store.planetsCount,
    planetCurrentPage: store.planetCurrentPage,
  }));

  useEffect(() => {
    let currentPage = parseInt(searchParams.get("page")) || 1;
    if(searchParams.get("page") === null && !planetCurrentPage) {
      currentPage = 1;
    } 
    if(searchParams.get("page") === null && planetCurrentPage) {
      currentPage = planetCurrentPage
      setSearchParams({ page: planetCurrentPage })
    }
    console.log(planetCurrentPage, currentPage, searchParams.get("page"))
    if(!planets.length || !!currentPage && planetCurrentPage !== currentPage) {
        fetchPlanets(currentPage);
    }
  }, [planets.length, searchParams]);

  const filteredPlanets = getFilteredPlanets(searchTerm);
  
  return (
    <div className="planets">
      <PageTitle>Planets</PageTitle>

      <input
        type="text"
        className="filterBox"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Filter..."
      />
   
      <div className="list">
        {filteredPlanets.map(planet => (
          <Link
            className="listItem"
            key={planet.id}
            to={`/planets/${planet.id}`}
          >
            {planet.name}
          </Link>
        ))}
      </div>

      <footer><Pagination session='planets' count={planetsCount}/></footer>

    </div>
  );
};

export default observer(Planets);
