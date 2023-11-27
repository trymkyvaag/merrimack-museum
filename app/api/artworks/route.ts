import { NextRequest, NextResponse } from "next/server";

// Goal: Contact Django back end endpoint that returns random artwork
export async function POST(req: NextRequest) {
    // Get the value from the body
    let passedValue = await new NextResponse(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    // If the value is an instance of a string and equal to "all" *not case sensitive
    if (typeof valueToJson === 'string' && valueToJson.toLowerCase() === 'all') {

        // Fetch data from the "randomartworksall" endpoint
        try {
            const randomArtworksResponse = await fetch('http://127.0.0.1:8000/api/randomartworksall/', {
                method: 'POST', // Type post
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
                body: JSON.stringify({ all_artworks: valueToJson }),

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
        // The value is an integer
    } else {
        const int = valueToJson; // parse value from body to int
        try {
            // Fetch data from the "randomartworks" endpoint
            const randomArtworksResponse = await fetch('http://127.0.0.1:8000/api/randomartworksint/', {
                method: 'POST', // Type post
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
                cache: 'no-store',
                body: JSON.stringify({ num_artworks: int }),  // Endpoint expects num_artworks: 'int' as input. Default as 5 for now.

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
    }
};

