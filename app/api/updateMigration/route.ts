import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const data = await req.json();
    const id = data.id;
    const type = data.type;
    console.log(`Sending data: ${JSON.stringify(id)}`);
    console.log(`Sending data: ${JSON.stringify(type)}`);
    try {
        const externalApiResponse = await fetch(`http://localhost:8000/api/migrations-update/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
            body: JSON.stringify({ "type": type })
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