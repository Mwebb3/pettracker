import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = ()=> {
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchOwners = async() => {
      const response = await axios.get('/api/owners');
      setOwners(response.data);
    }
    fetchOwners();
  }, []);

  useEffect(() => {
    const fetchPets = async() => {
      const response = await axios.get('/api/pets');
      setPets(response.data);
    }
    fetchPets();
  }, []);

  const addOwner = async(pet, owner) => {
    pet = {...pet, owner_id: owner.id};
    const response = await axios.put(`/api/pets/${pet.id}`, pet);
    pet = response.data;
    setPets(pets.map(animal => animal.id === pet.id ? pet: animal));
  };

  const removeOwner = async(pet) => {
    pet = {...pet, owner_id: null};
    const response = await axios.put(`/api/pets/${pet.id}`, pet);
    pet = response.data;
    setPets(pets.map(animal => animal.id === pet.id ? pet: animal));
  }

  return (
    <div>
      <h1>The Pet Club</h1>
      <main>
        <div>
          <h2>Owners ({owners.length})</h2>
          <ul>
            {
              owners.map((owner) => {
                const ownersPets = pets.filter(pet=> pet.owner_id === owner.id);
                return(
                  <li key={owner.id}>
                    {owner.name}
                    ({ownersPets.length})
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div>
          <h2>Pets ({pets.length})</h2>
          <ul>
            {
              pets.map((pet) => {
                return(
                  <li key={pet.id}>
                    {pet.name}
                    <ul>
                      {
                        owners.map((owner) => {
                          return(
                            <li key={owner.id} className={pet.owner_id === owner.id ? "user": ""}>
                              {owner.name}
                              {
                                pet.owner_id === owner.id ? (
                                  <button 
                                  onClick={() => removeOwner(pet)}>
                                    Remove
                                  </button>
                                ): (
                                  <button 
                                  onClick={() => addOwner(pet, owner)}>
                                    Add
                                  </button>
                                )
                              }
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
