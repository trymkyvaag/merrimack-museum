'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UnstyledButton, Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper, useMantineTheme, Switch, Tooltip, rem } from '@mantine/core';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser, useRequest } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import image from '@/public/404.svg';
import classesTwo from '@/styles/NotFoundImage.module.css';
import { format } from 'date-fns';

export default function About() {
    const theme = useMantineTheme();
    const { data: session, status, update } = useSession();
    const { artworks } = useArtwork();
    const { isAdmin, isFaculty } = useUser();
    const { request } = useRequest();
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    const [selected, setSelected] = useState(artworks[0] || null);
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    // const handleMenuItemClick = (item: any) => {
    //     setSelected(item);
    // };

    // const items = artworks.map((item) => (
    //     <Menu.Item
    //         onClick={() => handleMenuItemClick(item)}
    //         key={item.idartwork}
    //     >
    //         {item.idartwork}
    //     </Menu.Item>
    // ));

    const form = useForm({
        initialValues: {
            title: '',
            date_created_month: '',
            date_created_year: '',
            comments: '',
            width: '',
            height: '',
            artist_name: '',
            donor_name: '',
            location: '',
            category: '',
            image_path: '',
        },
        validate: {
            title: (value) => value.trim().length === 0,
            date_created_month: (value) => value.trim().length === 0,
            date_created_year: (value) => value.trim().length === 0,
            comments: (value) => value.trim().length === 0,
            width: (value) => value.trim().length === 0,
            height: (value) => value.trim().length === 0,
            artist_name: (value) => value.trim().length === 0,
            donor_name: (value) => value.trim().length === 0,
            location: (value) => value.trim().length === 0,
            category: (value) => value.trim().length === 0,
            image_path: (value) => value.trim().length === 0,
        },
    });

    const handleSubmit = () => {
        console.log("Form submitted");
        // if (!selected) {
        //     console.error("Selected is undefined or null");
        //     return;
        // }

        const data = {
            ...form.values,
        }
        console.log("Request Page: Before sending to nextjs api");
        console.log(data)
        fetch('api/addArtwork', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((data) => {
            console.log("Response Data:", data);
        }).catch((error) => {
            console.error("Error:", error);
        });
    };

    return (
        <>

            {

                <Container>

                    <Container px='lg' py='lg' size='sm'>
                        <form>
                            <Title
                                order={2}
                                size="h1"
                                style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                                fw={900}
                                ta="center"
                            >
                                Add a New Artwork
                            </Title>

                            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                <TextInput
                                    label="Title"
                                    placeholder="The Oasis"
                                    name="title"
                                    variant="filled"
                                    {...form.getInputProps('title')}
                                />
                                <TextInput
                                    label="Artist Name"
                                    placeholder="Mark"
                                    name="artist_name"
                                    variant="filled"
                                    {...form.getInputProps('artist_name')}
                                />
                            </SimpleGrid>

                            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                <TextInput
                                    label="Category"
                                    placeholder="Photograph"
                                    name="category"
                                    variant="filled"
                                    {...form.getInputProps('category')}
                                />
                                <TextInput
                                    label="Location"
                                    placeholder="Palmisano"
                                    name="location"
                                    variant="filled"
                                    {...form.getInputProps('location')}
                                />
                            </SimpleGrid>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                <TextInput
                                    label="Width"
                                    placeholder="0.000"
                                    name="width"
                                    variant="filled"
                                    {...form.getInputProps('width')}
                                />
                                <TextInput
                                    label="Height"
                                    placeholder="0.000"
                                    name="height"
                                    variant="filled"
                                    {...form.getInputProps('height')}
                                />
                            </SimpleGrid>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                <TextInput
                                    label="Date Created - Month"
                                    placeholder="MM"
                                    name="date_created_month"
                                    variant="filled"
                                    {...form.getInputProps('date_created_month')}
                                />
                                <TextInput
                                    label="Date Created - Year"
                                    placeholder="YYYY"
                                    name="date_created_year"
                                    variant="filled"
                                    {...form.getInputProps('date_created_year')}
                                />
                            </SimpleGrid>
                            <Textarea
                                mt="md"
                                label="Comments"
                                placeholder="Your comments"
                                maxRows={10}
                                minRows={5}
                                autosize
                                name="comments"
                                variant="filled"
                                {...form.getInputProps('comments')}
                            />

                            <Group justify="center" mt="xl">
                                {/* <Link href="/gallery" passHref> */}

                                <Button type="submit" size="md" onClick={handleSubmit}>
                                    Add Artwork
                                </Button>
                                {/* </Link> */}
                            </Group>
                        </form>
                    </Container>

                </Container>
                // :
                // <Container className={classesTwo.root}>
                //     <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                //         <Image src={image.src} className={classesTwo.mobileImage} />
                //         <div>
                //             <Title className={classesTwo.title}>Please sign in...</Title>
                //             <Text c="dimmed" size="lg">
                //                 Note: Only Admin may access the dashboard
                //             </Text>
                //             {/* <Button variant="outline" size="md" mt="xl" className={classesTwo.control}>
                //                                     Get back to home page
                //                                 </Button> */}
                //         </div>
                //         <Image src={image.src} className={classesTwo.desktopImage} />
                //     </SimpleGrid>
                // </Container>
            }
        </>
    );
}