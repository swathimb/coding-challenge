import { types, getSnapshot } from 'mobx-state-tree';

import apiService from '../services/api.js';
import PlanetModel from '../models/Planet.model.js';
import PersonModel from '../models/Person.model.js';

const { model, array, optional, map, boolean, number } = types;

const StarWarsStore = model('StarWarsStore', {
  planets: optional(array(PlanetModel), []),
  people: optional(array(PersonModel), []),

  loadingPlanets: optional(boolean, false),
  loadingPeople: optional(boolean, false),

  planetsCount: optional(number, 0),
  peopleCount: optional(number, 0),

  planetCurrentPage: optional(number, 0),
  peopleCurrentPage: optional(number, 0),

})
  .actions(self => ({
    async afterCreate() {
    },

    async fetchPlanets(page) {
      console.log('In Planet Store')
      if (self.planets.length > 0 && self.peopleCurrentPage === page) return self.planets;
      self.setLoadingPlanets(true);
      const { data } = await apiService.getPlanets(page);
      self.setLoadingPlanets(false);
      self.setPlanetsCount(data.count);
      self.setPlanets(data.results);
      self.setPlanetCurrentPage(page);
      return data.results;
    },
    async fetchPeople(page = 1) {
      if (self.people.length > 0 && self.peopleCurrentPage === page) return self.people;
      self.setLoadingPeople(true);
      const { data } = await apiService.getPeople(page);
      console.log('In People Store', data)
      self.setLoadingPeople(false);
      self.setPeople(data.results);
      self.setPeopleCount(data.count);
      self.setPeopleCurrentPage(page);
      return data.results;
    },

    setLoadingPlanets(bool) {
      self.loadingPlanets = bool;
    },
    setLoadingPeople(bool) {
      self.loadingPeople = bool;
    },
    setPlanets(planets) {
      self.planets = planets;
    },
    setPeople(people) {
      self.people = people;
    },
    setPlanetsCount(count) {
      self.planetsCount = count;
    },
    setPeopleCount(count) {
      self.peopleCount = count;
    },
    setPeopleCurrentPage(page) {
      self.peopleCurrentPage = page;
    },
    setPlanetCurrentPage(page) {
      self.planetCurrentPage = page;
    }
  }))
  .views(self => ({
    getFilteredPeople(searchTerm) {
      searchTerm = searchTerm.trim();

      if (!searchTerm) return self.people;

      return self.people.filter(person => (
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    },
    getFilteredPlanets(searchTerm) {
      searchTerm = searchTerm.trim();

      if (!searchTerm) return self.planets;

      return self.planets.filter(planet => (
        planet.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    },
    getPlanet(planetId) {
      return self.planets.find(planet => planet.id === parseInt(planetId));
    },
    getPerson(personId) {
      return self.people.find(person => person.id === parseInt(personId));
    },
  }));

export default StarWarsStore;
