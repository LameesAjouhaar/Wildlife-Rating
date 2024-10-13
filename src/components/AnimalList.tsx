import React, { useState } from 'react';
import axios from 'axios';
import AnimalRating from './AnimalRating';

interface Animal {
    name: string;
    characteristics: Record<string, any>;
    rating?: number;
}

const AnimalList: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState<Animal[]>(() => {
        const storedFavorites = localStorage.getItem('favoriteAnimals');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

    const fetchAnimals = async (animalName: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.api-ninjas.com/v1/animals?name=${animalName}`, {
                headers: { 'X-Api-Key': process.env.REACT_APP_API_KEY! },
            });
            setAnimals(response.data);
        } catch (error) {
            console.error('Error fetching animal data:', error);
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm) {
            fetchAnimals(searchTerm);
        }
    };

    const addToFavorites = (animal: Animal) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = [...prevFavorites, animal];
            localStorage.setItem('favoriteAnimals', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    const removeFromFavorites = (animalToRemove: Animal) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter(animal => animal.name !== animalToRemove.name);
            localStorage.setItem('favoriteAnimals', JSON.stringify(updatedFavorites));

            if (selectedAnimal?.name === animalToRemove.name) {
                setSelectedAnimal(null);
            }

            return updatedFavorites;
        });
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded p-2"
                    placeholder="Search for an animal..."
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
                    Search
                </button>
            </form>

            {loading ? (
                <p>Loading animals...</p>
            ) : (
                <div className="grid grid-cols-5 gap-4">
                    {animals.length > 0 ? (
                        animals.map((animal, index) => (
                            <div key={index} className="p-4 border rounded shadow">
                                <h2 className="text-lg font-bold">{animal.name}</h2>
                                <button
                                    onClick={() => addToFavorites(animal)}
                                    className="mt-2 bg-blue-500 text-white p-2 rounded"
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No animals found. Please try another search.</p>
                    )}
                </div>
            )}

            <h2 className="text-xl font-bold mt-6">Favorite Animals</h2>
            <div className="grid grid-cols-1 gap-4">
                {favorites.length > 0 ? (
                    favorites.map((animal, index) => (
                        <div key={index} className="p-4 border rounded shadow">
                            <h2 className="text-lg font-bold">{animal.name}</h2>
                            <button
                                onClick={() => setSelectedAnimal(animal)}
                                className="mt-2 bg-blue-500 text-white p-2 rounded"
                            >
                                Rate
                            </button>
                            <button
                                onClick={() => removeFromFavorites(animal)}
                                className="mt-2 bg-red-500 text-white p-2 rounded ml-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No favorite animals added yet.</p>
                )}
            </div>

            {selectedAnimal && (
                <AnimalRating
                    animalName={selectedAnimal.name}
                    attributes={Object.keys(selectedAnimal.characteristics)}

                />
            )}
        </div>
    );
};

export default AnimalList;
