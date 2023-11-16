import { NextRequest, NextResponse } from "next/server";

// Goal: Contact Django back end endpoint that returns random artwork
export async function POST(req: NextRequest) {


    let passedValue = await new NextResponse(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const x = parseInt(valueToJson);
    console.log("here: ", x);
    try {

        // Fetch data from the "randomartworks" endpoint
        const randomArtworksResponse = await fetch('http://127.0.0.1:8000/api/randomartwork/', {
            method: 'POST', // Type post
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ num_artworks: x }),  // Endpoint expects num_artworks: 'int' as input. Default as 5 for now.

        });
        if (!randomArtworksResponse.ok) {
            throw new Error('Failed to fetch data from randomartworks');
        }

        // Grab data
        const data = await randomArtworksResponse.json();

        // Return data response in json format
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching image URLs:', error);
        return NextResponse.json({ error: 'Server error' });
    }

};

