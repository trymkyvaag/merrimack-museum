import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {

    const data = await req.json();

    console.log("INSIDE SERVER");
    try {
        if (!data) {
            return NextResponse.json({ error: 'Form data is missing in the request body' }, { status: 400 });
        }

        const id = (data.idArtwork || '').toString().trim();
        console.log(id);


        const externalApiResponse = await fetch(`http://localhost:8000/api/update-artwork/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
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
