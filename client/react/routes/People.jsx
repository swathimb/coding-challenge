import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../stores/StoreProvider.js';
import PageTitle from '../components/PageTitle.jsx';
import Pagination from '../components/Pagination.jsx';
import styles from './people.scss';
import { getSnapshot } from 'mobx-state-tree';

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const { people, getFilteredPeople, fetchPeople, peopleCount, peopleCurrentPage } = useMst(store => ({
    people: store.people,
    getFilteredPeople: store.getFilteredPeople,
    fetchPeople: store.fetchPeople,
    peopleCount: store.peopleCount,
    peopleCurrentPage: store.peopleCurrentPage,
  }));

  useEffect(() => {
  let currentPage = parseInt(searchParams.get("page")) || 1;
  if(searchParams.get("page") === null && !peopleCurrentPage) {
    currentPage = 1;
  } 
  if(searchParams.get("page") === null && peopleCurrentPage) {
    currentPage = peopleCurrentPage
    setSearchParams({ page: peopleCurrentPage })
  }
  if(!people.length || !!currentPage && peopleCurrentPage !== currentPage) {
      fetchPeople(currentPage);
  }
}, [people.length, searchParams]);

  const filteredPeople = getFilteredPeople(searchTerm);

  return (
    <div className="people">
      <PageTitle>People</PageTitle>

      <input
        type="text"
        className="filterBox"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Filter..."
      />
      <div className="list">
        {filteredPeople.map(person => (
          <Link
            className="listItem"
            key={person.id}
            to={`/person/${person.id}`}
          >
            {person.name}
          </Link>
        ))}
      </div>
      <footer><Pagination section='people' count={peopleCount}/></footer>
      
    </div>
  );
};

export default observer(People);
