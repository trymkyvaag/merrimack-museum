import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from "next/server";

// Goal: Contact Django back end endpoint that returns random artwork
export async function POST(req: NextRequest) {


    let passedValue = await new NextResponse(req.body).text();
    console.log("\n\n\nRecived keywords: " + passedValue)
    

    try {

        // Fetch data from the "randomartworks" endpoint
        const sewarchArtworksResponse = await fetch('http://127.0.0.1:8000/api/searchartwork/', {
            method: 'POST', // Type post
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: passedValue }),

        });
        if (!sewarchArtworksResponse.ok) {
            throw new Error('Failed to fetch data from SearchArtworks');
        }

        // Grab data
        const data = await sewarchArtworksResponse.json();
        console.log("Returned data: |" + data + "|")

        // Return data response in json format
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching image URLs:', error);
        return NextResponse.json({ error: 'Server error' });
    }

};

