import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const externalApiResponse = await fetch('http://localhost:8000/api/artworks-list/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
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