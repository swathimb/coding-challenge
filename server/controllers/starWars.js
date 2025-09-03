import axios from "axios";

const api = 'https://swapi.dev/api';
const cache = {}; // cache not frozen for this file, but outputs to other files will be frozen

export default {
  getPeople,
  getPlanets,
  getPlanetsWithResidents,
  getPlanet,
  getPerson,
  getHomeWorldData
};

async function getPeople(sortBy, page) {
  let rootApi = api + '/people';
  if (page) {
    rootApi = rootApi + `?page=${page}`
  }
  const cacheKey = 'people';
  const peopleData = await getResults(rootApi, cacheKey);
  const modifiedData = await Promise.all(
    peopleData.results.map(async (item) => await getHomeWorldData(item))
  );
  return {
    ...peopleData,
    results: modifiedData
  }
}

async function getHomeWorldData(people) {
  const planetId = people.homeworld.split('/').slice(-2, -1).join('')
  const { data: planetData } = await getPlanet(parseInt(planetId))
  people.homeworld = planetData;
  people.homeworld.id = parseInt(planetId)
  return people;
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

async function getPerson(personUrl) {
  return getResult(personUrl);
}

async function getPlanetsWithResidents(sortBy, page) {
  const planetsData = await getPlanets(sortBy, page);

  // cheater way to deep clone an object
  const planetList = JSON.parse(JSON.stringify(Object.values(planetsData.results)));

  return {
    ...planetsData,
    results: planetList,
  };
}

/* helper methods */
async function getResults(rootApi, cacheKey, page = 1) {
  const startTime = new Date().valueOf();

  async function getPage(nextPage) {
    const { data } = await axios.get(nextPage);
    if (data.results) {

      const modifiedData =
        data.results.map((item) => {
          const id = item.url.split('/').slice(-2, -1).join('');
          item.id = parseInt(id); // make things easier for the front-end
          return item;
        })
      data.results = modifiedData;
      return data;
    }
  }

  const data = await getPage(rootApi);
  console.log(`${rootApi} timing: ${new Date().valueOf() - startTime} | result count: ${Object.values(data.results).length}`);
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results,
  };
}

async function getResult(rootApi) {
  const startTime = new Date().valueOf();
  const result = await axios.get(rootApi);
  console.log(`${rootApi} timing: ${new Date().valueOf() - startTime}`);
  return result
}
