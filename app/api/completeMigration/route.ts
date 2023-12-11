import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const data = await req.json();
    const id = data.id;
    const type = data.type;
    const location = data.location;
    const idArtwork = data.idArtwork;
    console.log(`Sending data: ${JSON.stringify(id)}`);
    console.log(`Sending data: ${JSON.stringify(type)}`);
    console.log(`Sending data: ${JSON.stringify(location)}`);
    console.log(`Sending data: ${JSON.stringify(idArtwork)}`);
    try {
        const externalApiResponse = await fetch(`http://127.0.0.1:8000/api/migrations-update-complete/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
            body: JSON.stringify({
                "type": type,
                "location": location,
                "idArtwork": idArtwork
            })
        });
        if (externalApiResponse.ok) {
            const responseData = await externalApiResponse.json();

            return NextResponse.json(responseData)
        } else {
            console.error('External API request failed');
            return NextResponse.json({ error: 'External API request failed' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' });
    }
}