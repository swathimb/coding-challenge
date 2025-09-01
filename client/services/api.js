import axios from 'axios';

export default {
  getPlanets,
  getPeople,
  getPerson,
  getPlanet
};

function getPlanets() {
  return axios.get('/api/starWars/planets', {
    params: {
      sortBy: 'name',
      replacePeopleNames: false,
    }
  });
}

function getPeople() {
  return axios.get('/api/starWars/people', {
    params: {
      sortBy: 'name',
    }
  });
}

function getPerson(personId) {
  return axios.get(`/api/starWars/people/${personId}`);
}

function getPlanet(planetId) {
  return axios.get(`/api/starWars/planets/${planetId}`);
}
