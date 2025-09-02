import axios from 'axios';

export default {
  getPlanets,
  getPeople,
  getPerson,
  getPlanet
};

function getPlanets(page) {
  let queryParameters = {
    sortBy: 'name',
    replacePeopleNames: 'false',
  }
  if (page) {
    queryParameters.page = page;
  }
  return axios.get('/api/starWars/planets', {
    params: queryParameters
  });
}

function getPeople(page) {
  const rootApi = '/api/starWars/people';
  let queryParameters = {
    sortBy: 'name',
  }
  if (page) {
    queryParameters.page = page;
  }
  return axios.get(rootApi, { params: queryParameters });
}

function getPerson(personId) {
  return axios.get(`/api/starWars/people/${personId}`);
}

function getPlanet(planetId) {
  return axios.get(`/api/starWars/planets/${planetId}`);
}
