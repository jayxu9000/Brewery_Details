import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css'

function BreweryDetail({ data }) {
  const { id } = useParams();
  const brewery = data.find(b => b.id.toString() === id);
  console.log('ID from useParams:', id);
  console.log('Data received in BreweryDetail:', data);

  if (!brewery) {
    return <div>No brewery found with the given ID.</div>;
  }

  return (
    <div className='breweryDetails'>
      <Link to="/">← Go Back</Link>
      <h2>Brewery Details</h2>
      <div>
        <p>Name: {brewery.name}</p>
        <p>City: {brewery.city}</p>
        <p>State: {brewery.state}</p>
        <p>Address: {brewery.address_1}</p>
        <p>Phone: {brewery.phone}</p>
        <p>Website: {brewery.website_url}</p>
      </div>
    </div>
  );
}

export default BreweryDetail;
