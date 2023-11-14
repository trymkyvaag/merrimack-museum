import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        if (!data) {
            return NextResponse.json({ error: 'Form data is missing in the request body' }, {status: 400});
        }

        console.log(`Sending data: ${JSON.stringify(data)}`);
        const externalApiResponse = await fetch('http://localhost:8000/api/move-request/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: data.email,
                to_location: data.destination,
                is_pending: true,
                is_approved: false,
                comments: data.message,
                artwork: data.artwork,
            }),
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
