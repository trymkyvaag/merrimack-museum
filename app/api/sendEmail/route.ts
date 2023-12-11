import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        if (req.body != null) {
            // Read the request body as text
            const bodyText = await req.text();
            // Parse the JSON content
            const { message } = JSON.parse(bodyText);
            window.open(`mailto:artmerrimack@example.com?subject=$ContactForm&body=${message}`);
        }

        // Create a nodemailer transporter (attempt)
        //         const transporter = nodemailer.createTransport({
        //             host: 'smtp.gmail.com',
        //             port: '587', // must be 587 for gmail
        //             auth: {
        //                 user: 'artmerrimack@gmail.com',
        //                 pass: 'MerrimackArt123'
        //             }
        //         })

        //         // Email configuration
        //         const mailOptions = {
        //             from: email,
        //             to: 'trympert@gmail.com', //
        //             subject: 'New Contact',
        //             text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        //         };

        //         // Send the email
        //         const info = await transporter.sendMail(mailOptions);

        //         console.log('Email sent:', info.response);

        //         return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Server error' });
    }
}