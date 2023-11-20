// import fs from 'fs';

// const imagePaths: string[] = [];

// export const fetchRandomArtwork = (count = 5) => {
//     fetch('http://localhost:8000/api/randomartwork/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ num_artworks: count }), // Send the count as JSON in the request body
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Failed to fetch random artwork');
//             }
//             return response.json();
//         })
//         .then((data) => {
//             const newImagePaths: string[] = data.map((item: { image_path: string }) => item.image_path);
//             imagePaths.length = 0; // Clear the existing array
//             imagePaths.push(...newImagePaths);
//             console.log(data);
//             console.log(imagePaths);


//             const imageUrls: string[] = imagePaths
//                 .map((directoryPath) => {
//                     const files = fs.readdirSync(directoryPath);
//                     const imageFile = files.find((file) => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
//                     if (imageFile) {
//                         return `${directoryPath}/${imageFile}`;
//                     }
//                     return null; // No image found in the directory
//                 })
//                 .filter((url) => url !== null) as string[];



//             console.log(imageUrls);


//         })
//         .catch((error) => {
//             console.error('Error fetching random artwork:', error);
//         });
// };

