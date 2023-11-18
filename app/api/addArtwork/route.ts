import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("INSIDE SERVER");
    try {
        const data = await req.json();

        if (!data) {
            return NextResponse.json({ error: 'Form data is missing in the request body' }, { status: 400 });
        }

        //console.log(`Sending data: ${JSON.stringify(data)}`);
        console.log(data.title);
        console.log(data.artist_name);
        console.log(data.category);
        console.log(data.location);
        console.log(data.width);
        console.log(data.height);
        console.log(data.date_created_month);
        console.log(data.date_created_year);
        console.log(data.comments)
        console.log("INSIDE SERVER");
        const externalApiResponse = await fetch('http://localhost:8000/api/add-artwork/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": data.title,
                "artist_name": data.artist_name,
                "category": data.category,
                "location": data.location,
                "width": data.width,
                "height": data.height,
                "date_created_month": data.date_created_month,
                "date_created_year": data.date_created_year,
                "comments": data.comments
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

