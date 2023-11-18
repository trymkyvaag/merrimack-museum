'use client'

import { useEffect, useState, useRef } from 'react';
import { Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper, useMantineTheme, Switch, Tooltip, rem } from '@mantine/core';
import { IconX, IconDownload, IconCloudUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser, useRequest } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import { Dropzone } from '@mantine/dropzone';

import { Center, UnstyledButton, Stack } from '@mantine/core';

import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconCirclePlus,
    IconUserEdit,
    IconEdit,
    IconMailQuestion,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
//import classes from './NavbarMinimalColored.module.css';

let uploadedFileName = '';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick, isLast }: NavbarLinkProps) {
    const linkClassName = isLast ? classes.linkLast : classes.link;

    return (
        <Tooltip label={label} transitionProps={{ duration: 0 }}>
            <UnstyledButton style={!isLast ? { marginRight: '16px', paddingTop: '2.5rem' } : {}} onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconCirclePlus, label: 'Add Artwork' },
    { icon: IconEdit, label: 'Edit Artwork' },
    { icon: IconUserEdit, label: 'Manage Users' },
    { icon: IconMailQuestion, label: 'Manage Migrations' },
];




export default function About() {
    const theme = useMantineTheme();
    const { data: session, status, update } = useSession();
    const { artworks } = useArtwork();
    const { isAdmin, isFaculty } = useUser();
    const { request } = useRequest();
    const [active, setActive] = useState(2);
    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => handleIconClick(index)}
        />
    ));


    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
    const openRef = useRef<() => void>(null);
    const handleImageUpload = (files: File[]) => {
        // Only allow one image
        if (files.length > 0) {
            const file = files[0];
            setUploadedImages([file]);

            uploadedFileName = file.name;
            console.log(uploadedFileName);

            // Read the file as base64 and set the state
            const reader = new FileReader();
            reader.onload = () => {
                const base64Result = reader.result as string;
                setUploadedImageBase64(base64Result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);

    };

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
            uploadedFileName,
            uploadedImage: uploadedImageBase64

        }
        console.log("Request Page: Before sending to nextjs api");
        console.dir(data.uploadedImage);
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

    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleIconClick = (index: number) => {
        // Toggle the form visibility based on the clicked icon
        if (index === 0) {
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        } // Assuming the "Add Artwork" icon is at index 0
    };


    return (
        <>

            {


                <Container>
                    <nav className={classes.navbar}>

                        <div className={classes.navbarMain}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {links}
                            </div>
                        </div>


                    </nav>

                    <Container px='lg' py='lg' size='sm'>
                        {isFormVisible && (
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

                                <div className={classes.wrapper}>
                                    {uploadedImages.length === 0 ? (
                                        <Dropzone
                                            openRef={openRef}
                                            onDrop={handleImageUpload}
                                            className={classes.dropzone}
                                            radius="md"
                                            accept={['image/*']}
                                            maxSize={30 * 1024 ** 2}
                                        >
                                            <div style={{ pointerEvents: 'none' }}>
                                                <Group justify="center">
                                                    <Dropzone.Accept>
                                                        <IconDownload
                                                            style={{ width: rem(50), height: rem(50) }}
                                                            color={theme.colors.blue[6]}
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Accept>
                                                    <Dropzone.Reject>
                                                        <IconX
                                                            style={{ width: rem(50), height: rem(50) }}
                                                            color={theme.colors.red[6]}
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Reject>
                                                    <Dropzone.Idle>
                                                        <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                                                    </Dropzone.Idle>
                                                </Group>

                                                <Text ta="center" fw={700} fz="lg" mt="xl">
                                                    <Dropzone.Accept>Drop images here</Dropzone.Accept>
                                                    <Dropzone.Reject>Images must be less than 30mb</Dropzone.Reject>
                                                    <Dropzone.Idle>Upload images</Dropzone.Idle>
                                                </Text>
                                                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                                    Drag'n'drop images here to upload. We can accept any image type that is less than 30mb in size.
                                                </Text>
                                            </div>
                                        </Dropzone>
                                    ) : null}
                                </div>
                                {uploadedImages.map((image, index) => (
                                    <div key={index} style={{ position: 'relative', paddingTop: '10px', textAlign: 'center' }}>
                                        <Image src={URL.createObjectURL(image)} alt={`Uploaded Image ${index}`} />
                                        <div style={{ paddingTop: '10px', display: 'inline-block' }}>
                                            <Button onClick={() => removeImage(index)} color="red">
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}


                                <Group justify="center" mt="xl">
                                    {/* <Link href="/gallery" passHref> */}

                                    <Button type="submit" size="md" onClick={handleSubmit}>
                                        Add Artwork
                                    </Button>
                                    {/* </Link> */}
                                </Group>
                            </form>
                        )}
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