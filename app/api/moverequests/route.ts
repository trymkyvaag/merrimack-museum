import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const url = req.nextUrl;
        const email = url.searchParams.get('email');
        const headers = new Headers();
        
        for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') {
                headers.set(key, value);
            }
        }

        const externalApiResponse = await fetch(`http://localhost:8000/api/migration-requests/?email=${email}`, {
            method: 'GET',
            headers: headers
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


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        if (!data) {
            return NextResponse.json({ error: 'Form data is missing in the request body' }, {status: 400});
        }

        const externalApiResponse = await fetch('http://localhost:8000/api/migration-requests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
