const { sorter } = require('../utils');
const starWarsController = require('../controllers/starWars');

const router = require('express').Router();

router.get('/planets', getPlanets);
router.get('/people', getPeople);
router.get('/planets/:planetId', getPlanet);

module.exports = router;


async function getPlanets(req, res) {
  const {
    sortBy,
    replacePeopleNames = 'true',
  } = req.query;

  let planetList;
  let planets;
  try {
    if (replacePeopleNames === 'true') {
      planetList = await starWarsController.getPlanetsWithResidents();
    } else {
      planets = await starWarsController.getPlanets();
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
  const { sortBy } = req.query;

  try {
    const people = await starWarsController.getPeople();
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
