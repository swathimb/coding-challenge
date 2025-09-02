import axios from "axios";

const api = 'https://swapi.dev/api';
const cache = {}; // cache not frozen for this file, but outputs to other files will be frozen

export default {
  getPeople,
  getPlanets,
  getPlanetsWithResidents,
  getPlanet
};

async function getPeople(sortBy, page) {
  let rootApi = api + '/people';
  if (page) {
    rootApi = rootApi + `?page=${page}`
  }
  const cacheKey = 'people';
  return getResults(rootApi, cacheKey);
}

async function getPlanets(sortBy, page) {
  let rootApi = api + '/planets';
  const cacheKey = 'planets';
  if (page) {
    rootApi = rootApi + `?page=${page}`
  }
  return getResults(rootApi, cacheKey);
}

async function getPlanet(planetId) {
  const rootApi = api + '/planets' + `/${planetId}`;
  return getResult(rootApi);
}

async function getPlanetsWithResidents(sortBy, page) {
  const [planets, people] = await Promise.all([
    getPlanets(sortBy, page),
    getPeople(),
  ]);
  // cheater way to deep clone an object
  const planetList = JSON.parse(JSON.stringify(Object.values(planets.results)));
  const peopleList = JSON.parse(JSON.stringify(Object.values(people.results)));

  planetList.forEach(planet => {
    planet.residents = planet.residents.map(url => {
      const person = peopleList.find(person => person.url === url) || {};
      return person.name || 'unknown';
    });
  });

  return {
    ...planets,
    results: planetList,
  };
}


/* helper methods */
async function getResults(rootApi, cacheKey, page = 1) {
  const startTime = new Date().valueOf();

  // if (!cache[cacheKey]) {
  //   cache[cacheKey] = {};
  // }

  async function getPage(nextPage) {
    const { data } = await axios.get(nextPage);
    console.log(data)
    data.results && data.results.forEach(item => {
      // const id = item.url.replace(rootApi, '').replace(/\//g, '');
      const id = item.url.split('/').slice(-2, -1).join('')
      item.id = parseInt(id); // make things easier for the front-end
      // cache[cacheKey][id] = item;
    });
    return data;
  }

  // const url = `${rootApi}/?page=${page}`;
  const data = await getPage(rootApi);

  // return as frozen object so any mutating won't affect the cache in this file
  // const toReturn = Object.freeze(cache[cacheKey]);
  // console.log(`"${cacheKey}" | timing: ${new Date().valueOf() - startTime} | result count: ${Object.values(toReturn).length}`);
  // return toReturn;
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results,
  };
}

async function getResult(rootApi) {
  return await axios.get(rootApi);
}
