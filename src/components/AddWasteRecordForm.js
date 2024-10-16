import React, { useState } from 'react';
import axios from 'axios';

const AddWasteRecordForm = ({ deviceId,deviceType,userId }) => { // Accept deviceId as a prop
    const [weight, setWeight] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/waste/add', {
                weight,
                deviceId,
                deviceType,
                userId
            });
            setMessage('Waste record added successfully!');
            setWeight(''); // Reset the weight after submission
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Failed to add waste record'}`);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Add Waste Record </h2>
            <form onSubmit={handleSubmit} className="mt-2">
                <label className="block mb-2">Weight (kg):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />

                <button type="submit" className="bg-blue-500 text-white p-2">Add Waste Record</button>

                {message && <p className="mt-4">{message}</p>}
            </form>
        </div>
    );
};

export default AddWasteRecordForm;
