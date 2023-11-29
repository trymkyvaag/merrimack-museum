import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    console.log("INSIDE SERVER 2 ");
    try {
        const data = await req.json();

        if (!data) {
            return NextResponse.json({ error: 'Form data is missing in the request body' }, { status: 400 });
        }

        console.log("INSIDE SERVER 2");
        console.log(`Sending data: ${JSON.stringify(data)}`);
        const externalApiResponse = await fetch('http://localhost:8000/api/edit-user-privs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
            body: JSON.stringify({
                "address": data.address,
                "user_type": { "user_type": data.user_type },
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
        return NextResponse.json({ error: 'Server errorrr' });
    }
}

