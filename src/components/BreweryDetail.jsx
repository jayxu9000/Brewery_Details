import React from 'react';
import { useParams } from 'react-router-dom';

function BreweryDetail({ data }) {
  const { id } = useParams();
  const brewery = data.find(b => b.id === id);
  console.log('ID from useParams:', id);
  console.log('Data received in BreweryDetail:', data);

  if (!brewery) {
    return <div>No brewery found with the given ID.</div>;
  }

  return (
    <div>
      <h2>Brewery Details</h2>
      <div>
        <p>Name: {brewery.name}</p>
        <p>City: {brewery.city}</p>
        <p>State: {brewery.state}</p>
      </div>
    </div>
  );
}

export default BreweryDetail;
