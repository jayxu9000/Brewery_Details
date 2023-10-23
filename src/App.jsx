import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import BreweryDetail from './components/BreweryDetail';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';


function App() {

  const URL = 'https://api.openbrewerydb.org/v1/breweries'
  const [data, setData] = useState([]);
  const [mostFrequentBrewery, setMostFrequentBrewery] = useState(null);
  const [mostFrequentState, setMostFrequentState] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [stateCounts, setStateCounts] = useState({});
  
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

        setStateCounts(stateCounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data.length === 0) {
      fetchData();
    }

    console.log[data]

  }, [data]);

  const filteredData = data.filter((brewery) => {
    const nameMatch = brewery.name.toLowerCase().includes(searchText.toLowerCase());
    const cityMatch = brewery.city.toLowerCase().includes(cityFilter.toLowerCase());
    const stateMatch = brewery.state.toLowerCase().includes(stateFilter.toLowerCase());
    return nameMatch && cityMatch && stateMatch;

  });

  return (
    <Router>
      <div className='App'>
        <h1>Breweries in the US</h1>

        <Routes>
          <Route path="/breweries/:id" element={<BreweryDetail data={data} />} />
          <Route path="/" element={
            <div>
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
              <div className='barChart'>
                <h2>Number of Breweries In Each State</h2>        
                <BarChart width={830} height={350} data={Object.entries(stateCounts)} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis label={{ value: 'States', dy: 90}} dataKey="0" type="category" angle={-45} textAnchor="end" interval={0} />
                  <YAxis label={{ value: 'Number of Breweries', angle: -90, position: 'insideLeft', dy: 75 }} />
                  <Tooltip />
                  <Bar dataKey="1" fill="blue" />
                </BarChart>
              </div>
              <div className='breweryList'>
                <h2>List of Breweries</h2>
                <ul>
                  {filteredData.map(brewery => (
                    <li key={brewery.id} > <Link to={`/breweries/${brewery.id}`}>{brewery.name}</Link> @ {brewery.city}, {brewery.state}</li>
                  ))}
                </ul>
              </div>
            </div>
          }
          />
        </Routes>
      </div>
      
    </Router>
  )
}

export default App
