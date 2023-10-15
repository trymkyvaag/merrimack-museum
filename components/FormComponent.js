// components/FormComponent.js
import React, { useState, ChangeEvent } from 'react';

const FormComponent = () => {
    const [formData, setFormData] = useState({
        title: '',
        date_created_month: '',
        date_created_year: '',
        comments: '',
        width: '',
        height: '',
        artist_name: '',
        donor_name: '',
        location: '',
        category: ''


    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Handle form submission here
    // };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData), // Send the formData directly, not as an object inside another object
        };
        fetch('http://localhost:8000/api/addartwork/', requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <form onSubmit={handleFormSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="title">Title:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </td>
                            <td>
                                <label htmlFor="width">Size (width):</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="width"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="artist_name">Artist:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="artist_name"
                                    name="artist_name"
                                    value={formData.artist_name}
                                    onChange={handleChange}
                                />
                            </td>
                            <td>
                                <label htmlFor="height">Size (height):</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="donor_name">Donor:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="donor_name"
                                    name="donor_name"
                                    value={formData.donor_name}
                                    onChange={handleChange}
                                />
                            </td>
                            <td>
                                <label htmlFor="category">Category:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="date_created_month">Date (month):</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="date_created_month"
                                    name="date_created_month"
                                    value={formData.date_created_month}
                                    onChange={handleChange}
                                />
                            </td>
                            <td>
                                <label htmlFor="location">Location:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="date_created_year">Date (year):</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="date_created_year"
                                    name="date_created_year"
                                    value={formData.date_created_year}
                                    onChange={handleChange}
                                />
                            </td>
                            <td>
                                <label htmlFor="comments">Comments:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="comments"
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit" onClick={handleFormSubmit}>Submit</button>
            </form>
        </div>

    );
};

export default FormComponent;
