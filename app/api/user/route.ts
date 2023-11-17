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

        const externalApiResponse = await fetch(`http://localhost:8000/api/custom-users/get_user_by_email/?email=${email}`, {
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