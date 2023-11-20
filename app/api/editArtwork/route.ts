import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function PUT(req: NextRequest) {

    const data = await req.json();

    if (data.uploadedFileName && data.uploadedImage) {
        console.log("INSIDE FIRST IF");
        try {
            if (!data) {
                return NextResponse.json({ error: 'Form data is missing in the request body' }, { status: 400 });
            }

            const uploadedFileName = data.uploadedFileName;
            // Extract the base64 data from the string
            const base64Data = data.uploadedImage.split(',')[1];

            // Decode the base64 string to a Buffer

            const decodedData = Buffer.from(base64Data, 'base64');
            // Find the highest-numbered folder
            const imageDir = path.join(process.cwd(), 'public', 'images');
            const imageDirRel = path.relative('public', 'images');
            const folders = fs
                .readdirSync(imageDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)
                .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)));

            const highestFolderNumber =
                folders.length > 0 ? parseInt(folders[0].substring(1)) : 0;

            // Create a new folder with a number one higher than the highest-numbered folder
            const newFolderNumber = highestFolderNumber + 1;
            const newFolderName = `a${newFolderNumber}`;
            const newFolderPath = path.join(imageDir, newFolderName);

            const test = path.join('images', newFolderName);
            const test2 = path.join(test, uploadedFileName);
            console.log("NEW NAME", test2);

            fs.mkdirSync(newFolderPath);
            const relativePath = path.join(newFolderPath, uploadedFileName);

            fs.writeFileSync(relativePath, decodedData);
            //await fs.promises.writeFile(newFolderPath, decodedStringAtoB);



            const id = (data.idArtwork || '').toString().trim();
            console.log(id);


            const externalApiResponse = await fetch(`http://localhost:8000/api/update-artwork/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
                cache: 'no-store',
                body: JSON.stringify({
                    "title": data.title,
                    "artist_name": { "artist_name": data.artist_name },
                    "category": { "category": data.category },
                    "location": { "location": data.location },
                    "width": data.width,
                    "height": data.height,
                    "donor": { "donor_name": data.donor_name },
                    "date_created_month": data.date_created_month,
                    "date_created_year": data.date_created_year,
                    "comments": data.comments,
                    "image_path": { "image_path": test2 },
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
    } else {
        console.log("INSIDE SECOND IF");
        try {
            if (!data) {
                return NextResponse.json({ error: 'Form data is missing in the request body' }, { status: 400 });
            }

            console.log("INSIDE SERVER");
            const id = data.idArtwork;
            console.log(id);
            console.log(data.donor_name);
            const externalApiResponse = await fetch(`http://localhost:8000/api/update-artwork/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
                cache: 'no-store',
                body: JSON.stringify({
                    "title": data.title,
                    "artist": { "artist_name": data.artist_name },
                    "category": { "category": data.category },
                    "location": { "location": data.location },
                    "donor": { "donor_name": data.donor_name },
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
}