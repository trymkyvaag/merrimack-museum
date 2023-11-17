import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const externalApiResponse = await fetch('http://localhost:8000/api/artwork-images/', {
            method: 'GET',
        });

        if (externalApiResponse.ok) {
            const responseData = await externalApiResponse.json();

            // Set Cache-Control header to prevent caching
            return NextResponse.json(responseData, {
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            });
        } else {
            console.error('External API request failed');
            return NextResponse.json({ error: 'External API request failed' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' });
    }
}
