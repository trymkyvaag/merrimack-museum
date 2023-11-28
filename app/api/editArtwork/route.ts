import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';

export async function PUT(req: NextRequest) {

    const data = await req.json();
    console.log("INSIDE FIRST IF");
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
            console.log("donor name");
            console.log(data.donor_name);



            const s3 = new S3({
                region: 'us-east-2',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY!,
                    secretAccessKey: process.env.AWS_SECRET_KEY!,
                }
            });

            const params = {
                Bucket: 'merrimackartcollection',
                Key: uploadedFileName,
                Body: decodedData,
                ContentType: 'image/png',
            }


            try {
                console.log(params);
                const upload = await s3.send(new PutObjectCommand(params));
                console.log("Successfull upload")
            } catch (error) {
                console.log("Unsuccessfull upload")
            }

            // Check if date_created_month is an empty string, replace with null
            const month = data.date_created_month !== '' ? data.date_created_month : null;
            // Check if date_created_year is an empty string, replace with null
            const year = data.date_created_year !== '' ? data.date_created_year : null;

            console.log(month);
            console.log(year);

            const externalApiResponse = await fetch(`http://localhost:8000/api/update-artwork/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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
                    "date_created_month": month,
                    "date_created_year": year,
                    "comments": data.comments,
                    "image_path": { "image_path": 'https://d1pv6hg7024ex5.cloudfront.net/' + uploadedFileName, },
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
            // Check if date_created_month is an empty string, replace with null
            const month = data.date_created_month !== '' ? data.date_created_month : null;
            // Check if date_created_year is an empty string, replace with null
            const year = data.date_created_year !== '' ? data.date_created_year : null;

            console.log(month);
            console.log(year);

            console.log("INSIDE SERVER");
            const id = data.idArtwork;
            console.log(id);
            console.log("donor name");
            console.log(data.donor_name);
            const externalApiResponse = await fetch(`http://localhost:8000/api/update-artwork/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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
                    "date_created_month": month,
                    "date_created_year": year,
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