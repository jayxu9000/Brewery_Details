import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const URL = 'https://api.openbrewerydb.org/v1/breweries'
  const [data, setData] = useState([]);
  const [mostFrequentBrewery, setMostFrequentBrewery] = useState(null);
  const [mostFrequentState, setMostFrequentState] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL);
        setData(response.data);

        const breweryCounts = {};
        const stateCounts = {};

        response.data.forEach(brewery => {
          if (breweryCounts[brewery.name]) {
            breweryCounts[brewery.name]++;
          } else {
            breweryCounts[brewery.name] = 1;
          }

          if (stateCounts[brewery.state]) {
            stateCounts[brewery.state]++;
          } else {
            stateCounts[brewery.state] = 1;
          }
        });

        const mostFrequentBreweryName = Object.keys(breweryCounts).reduce(
          (a, b) => (breweryCounts[a] > breweryCounts[b] ? a : b),
          null
        );

        setMostFrequentBrewery(mostFrequentBreweryName);

        const mostFrequentStateName = Object.keys(stateCounts).reduce(
          (a, b) => (stateCounts[a] > stateCounts[b] ? a : b),
          null
        );

        setMostFrequentState(mostFrequentStateName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data.length === 0) {
      fetchData();
    }
  }, [data]);

  const filteredData = data.filter((brewery) => {
    const nameMatch = brewery.name.toLowerCase().includes(searchText.toLowerCase());
    const cityMatch = brewery.city.toLowerCase().includes(cityFilter.toLowerCase());
    const stateMatch = brewery.state.toLowerCase().includes(stateFilter.toLowerCase());
    return nameMatch && cityMatch && stateMatch;
  });

  return (
    <div className='App'>
      <h1>List of Breweries</h1>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search by brewery name'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by city (try 'austin')"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by state (try 'texas')"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        />
      </div>
      <div className='summaryStats'>
        <p>Number of Breweries: {data.length}</p>
        {mostFrequentBrewery && (
          <p>Most Frequent Brewery: {mostFrequentBrewery}</p>
        )}
        {mostFrequentState && (
          <p>State with Most Breweries: {mostFrequentState}</p>
        )}
      </div>
      <ul>
        {filteredData.map(brewery => (
          <li key={brewery.id}>{brewery.name} ||| {brewery.city}, {brewery.state}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
