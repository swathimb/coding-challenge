import express from 'express'

import sorter from '../utils.js';
import starWarsController from '../controllers/starWars.js';

const router = express.Router();

router.get('/planets', getPlanets);
router.get('/people', getPeople);
router.get('/planets/:planetId', getPlanet);
router.get('/person/:personId', getPerson);

export default router;


async function getPlanets(req, res) {
  const {
    sortBy,
    replacePeopleNames = 'true',
    page
  } = req.query;

  let planetList;
  let planets;
  try {
    if (replacePeopleNames === 'true') {
      planetList = await starWarsController.getPlanetsWithResidents(sortBy, page);
      planets = planetList;
      planetList = planetList.results;
    } else {
      planets = await starWarsController.getPlanets(sortBy, page);
      planetList = Object.values(planets.results);
      // planetList = Object.values(planets);
    }

    if (sortBy) {
      sorter(sortBy, planetList);
    }

    res.json({
      ...planets,
      results: planetList
    });
    // res.json(planetList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPeople(req, res) {
  const { sortBy, page } = req.query;

  try {
    const people = await starWarsController.getPeople(sortBy, page);
    const peopleList = Object.values(people.results);
    // const peopleList = Object.values(people);

    if (sortBy) {
      sorter(sortBy, peopleList);
    }


    res.json({
      ...people,
      results: peopleList
    });
    // res.json(peopleList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPlanet(req, res) {
  const { planetId } = req.params;

  try {
    const { data } = await starWarsController.getPlanet(planetId);

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPerson(req, res) {
  const { personId } = req.params;
  const rootApi = 'https://swapi.dev/api' + '/people' + `/${personId}`;
  try {
    let { data: personData } = await starWarsController.getPerson(rootApi);
    const perosonId = personData.url.split('/').slice(-2, -1).join('');
    personData.id = parseInt(perosonId);
    personData = await starWarsController.getHomeWorldData(personData)
    res.json(personData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
