'use client'

import { useState } from 'react';
import './about.css';

import { Open_Sans } from 'next/font/google'
import { Button, Center, Container, Input, Modal, Text, Textarea, TextInput } from '@mantine/core';

const openSans = Open_Sans({
    weight: '400',
    subsets: ['latin'],
});

export default function About() {

    const [contactUsModalOpen, setContactUsModalOpen] = useState(false);
    const [emailForm, setEmailForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleContactUsClick = () => {
        setContactUsModalOpen(true);
    };

    const handleModalClose = () => {
        setContactUsModalOpen(false);
    };

    const handleInputChange = (key: any, value: any) => {
        setEmailForm({
            ...emailForm,
            [key]: value,
        });
    };

    const handleSendEmail = (msg: string, name: string, email: string) => {
        console.log("calling send")
        // Perform the logic to send the email using the emailForm data
        console.log('Sending email:', emailForm);
        const newMsg = `From ${name}: ${email} \n` + msg
        window.open(`mailto:artmerrimack@gmail.com?subject=ContactForm&body=${`From ${name}: ${email} \n + ${msg}`}`);
    }

    return (
        <div className={`${openSans.className} about-container`} suppressHydrationWarning>
            <div>
                <p>
                    Art is an expression of human creativity, knowledge, and skill. It is usually produced to communicate a message. Most importantly, it is essential to understanding culture and society during a period of time. By looking and studying different art forms, we are able to learn more about ourselves and others. Additionally, art expands our imagination beyond the creative limits we set for ourselves.
                    Merrimack College has developed a modest collection of artworks from gifts by exhibiting professional artists (McQuade Library Gallery, 1970-1999 and the McCoy Gallery, 1999-2019). Additionally, the Merrimack College Art Collection includes a second group of artworks by Merrimack students. The Student Collection has been expanding through the generosity of our students.
                    Please view our works on the “Gallery” page, where a random selection of works will be shown via thumbnails. You can click on a small image to view a larger image, along with more details about the artwork.
                </p>
                <Button onClick={() => handleContactUsClick()} mt={30}>
                    Contact Us
                </Button>
            </div>

            <Modal opened={contactUsModalOpen} onClose={handleModalClose} centered>
                <Container p="xl">
                    <div style={{ textAlign: 'center' }}>
                        <Text size="xl" mb={40} className="text-align-center" >
                            Contact Us
                        </Text>
                    </div>
                    <TextInput
                        placeholder="Enter your name"
                        value={emailForm.name}
                        onChange={(event) => handleInputChange('name', event.currentTarget.value)}
                        mb={10}
                    />
                    <Input
                        placeholder="Enter your email"
                        value={emailForm.email}
                        onChange={(event: { currentTarget: { value: string; }; }) => handleInputChange('email', event.currentTarget.value)}
                        mb={10}
                    />
                    <Textarea
                        placeholder="Type your message here"
                        multiline
                        rows={4}
                        value={emailForm.message}
                        onChange={(event) => handleInputChange('message', event.currentTarget.value)}
                        mb={10}
                    />
                    <Button onClick={() => handleSendEmail(emailForm.name, emailForm.email, emailForm.message)} fullWidth>
                        Send Email
                    </Button>
                </Container>
            </Modal>
        </div>
    );
}