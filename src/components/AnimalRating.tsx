import React, { useState } from 'react';

interface AnimalRatingProps {
    animalName: string;
    attributes: string[];

}

const AnimalRating: React.FC<AnimalRatingProps> = ({ animalName, attributes }) => {
    const [rating, setRating] = useState(0);
    const [likedAttributes, setLikedAttributes] = useState<string[]>([]);

    const handleAttributeToggle = (attribute: string) => {
        setLikedAttributes((prev) =>
            prev.includes(attribute) ? prev.filter((attr) => attr !== attribute) : [...prev, attribute]
        );
    };

    const handleSubmit = () => {
        const animalData = { animalName, rating, likedAttributes };
        localStorage.setItem(animalName, JSON.stringify(animalData));
        alert(`Saved rating for ${animalName}`);
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold">{animalName}</h2>
            <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="0"
                max="5"
                className="border rounded p-1"
                placeholder="Rate (0-5)"
            />
            <div>
                {attributes.map((attr, index) => (
                    <div key={index}>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={likedAttributes.includes(attr)}
                                onChange={() => handleAttributeToggle(attr)}
                            />
                            <span className="ml-2">{attr}</span>
                        </label>
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white p-2 rounded">
                Save
            </button>

        </div>
    );
};

export default AnimalRating;
