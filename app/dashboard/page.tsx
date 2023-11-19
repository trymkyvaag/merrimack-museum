'use client'

import { useEffect, useState, useRef } from 'react';
import { Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, useMantineTheme, Tooltip, rem, AspectRatio, Card } from '@mantine/core';
import { IconX, IconDownload, IconCloudUpload, IconChevronDown } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser, useRequest } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import { Dropzone } from '@mantine/dropzone';
import { UnstyledButton, Stack } from '@mantine/core';
import {
    IconHome2,
    IconCirclePlus,
    IconUserEdit,
    IconEdit,
    IconMailQuestion,
} from '@tabler/icons-react';
import Link from 'next/link';
import { DateTime } from 'luxon';
// Navbar interface
interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
    isLast: number
}

interface Artwork {
    idartwork: number;
    artist: {
        artist_name: string;
    };
    category?: {
        category: string;
    };
    title: string | null;
    date_created_month?: number | null;
    date_created_year?: number | null;
    width?: string | null;
    height?: string | null;
    donor?: string | null;
    location?: {
        location: string;
    } | null;
    comments?: string | null;
    image_path: {
        image_path: string;
    };
}

interface Migrations {
    idmove_request: number | null;
    artwork: {
        idartwork: number;
        artist: {
            artist_name: string;
        };
        category?: {
            category: string;
        };
        title: string | null;
        date_created_month?: number | null;
        date_created_year?: number | null;
        width?: string | null;
        height?: string | null;
        donor?: string | null;
        location?: {
            location: string;
        } | null;
        comments?: string | null;
        image_path: {
            image_path: string;
        };
    };
    comments: string;
    to_location: string;
    is_pending: boolean;
    is_approved: boolean;
    user: {
        address: string;
    }
    time_stamp: DateTime;
}

// Keep track of "Add Artwork FileName"
let uploadedFileName = '';

// Icons I'm using in floating nav bar
const mockdata = [
    { icon: IconCirclePlus, label: 'Add Artwork' },
    { icon: IconEdit, label: 'Edit Artwork' },
    { icon: IconUserEdit, label: 'Manage Users' },
    { icon: IconMailQuestion, label: 'Manage Migrations' },
];

// Navbar link function
function NavbarLink({ icon: Icon, label, active, onClick, isLast }: NavbarLinkProps) {
    return (
        <Tooltip label={label} transitionProps={{ duration: 0 }}>
            <UnstyledButton style={!isLast ? { marginRight: '16px', paddingTop: '2.5rem' } : {}} onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

// Page content
export default function About() {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const { data: session, status, update } = useSession();
    const { isAdmin, isFaculty } = useUser();
    const [active, setActive] = useState(2);
    const privilegeTypes = ['admin', 'FS', 'student'];
    const [selectedPrivilege, setSelectedPrivilege] = useState('Select Privilege Type');
    const openRef = useRef<() => void>(null);
    // Add images
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

    const [migrationData, setmigrationData] = useState([]);
    const [artworkData, setArtworkData] = useState([]);
    const [selected, setSelected] = useState<Artwork | string>(artworkData[0] || null);

    const [formData, setFormData] = useState({
        idArtwork: '',
        title: '',
        artist_name: '',
        donor_name: '',
        category: '',
        location: '',
        width: '',
        height: '',
        date_created_month: '',
        date_created_year: '',
        comments: '',
        image_path: ''
        // Add other form fields as needed
    });

    // Link mock data to icons
    const links = mockdata.map((link, index) => (
        <NavbarLink
            isLast={0}
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => handleIconClick(index)} />
    ));

    // Toggle forms based on icon click
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isUsersVisible, setIsUsersVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isMigrationsVisible, setIsMigrationsVisible] = useState(false);
    const handleIconClick = (index: number) => {
        if (index === 0) {
            setIsFormVisible(true);
            setIsUsersVisible(false);
            setIsEditVisible(false);
            setIsMigrationsVisible(false);
        } else if (index === 1) {
            setIsFormVisible(false);
            setIsEditVisible(true);
            setIsMigrationsVisible(false);
            setIsUsersVisible(false);
        } else if (index === 2) {
            setIsFormVisible(false);
            setIsUsersVisible(true);
            setIsEditVisible(false);
            setIsMigrationsVisible(false);
        } else if (index === 3) {
            setIsFormVisible(false);
            setIsUsersVisible(false);
            setIsEditVisible(false);
            setIsMigrationsVisible(true);
        }
    };

    // Initial add data values
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
        // Trimming
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

    // Uploading images for add artwork
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

    // Remove image for add artwork
    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);

    };

    // Handle submit for adding artwork
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
                'Cache-Control': 'no-store',
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

    // Handle adding user types to drop down (manage users page)
    const handleMenuItemClick = (item: any) => {
        setSelectedPrivilege(item);
    };

    const items = privilegeTypes.map((item) => (
        <Menu.Item
            onClick={() => handleMenuItemClick(item)}
            key={item}
        >
            {item}
        </Menu.Item>
    ));

    // Inital values for manage users page
    const formUser = useForm({
        initialValues: {
            address: '',
        },
        validate: {
            address: (value) => value.trim().length === 0,
        },
    });

    // Handle managing users page
    const handleUserSubmit = () => {
        console.log("Form submitted");
        // if (!selected) {
        //     console.error("Selected is undefined or null");
        //     return;
        // }

        const data = {
            ...formUser.values,
            user_type: selectedPrivilege

        }
        console.log("Request Page: Before sending to nextjs api");
        console.dir(data);
        fetch('api/editUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cache-Control': 'no-store'
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

    const handleMenuItemClick2 = (item: any) => {
        setSelected(item);

        setFormData({
            idArtwork: item.idartwork || '',
            title: item.title || '',
            donor_name: item.donor?.donor_name || '',
            artist_name: item.artist?.artist_name || '',
            category: item.category?.category || '',
            location: item.location?.location || '',
            width: item.width || '',
            height: item.height || '',
            date_created_month: item.date_created_month || '',
            date_created_year: item.date_created_year || '',
            comments: item.comments || '',
            image_path: item.image_path?.image_path || ''
        });


        console.log(formData.image_path);


    };

    const handleArtwork = () => {
        fetch('api/artworksList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.dir(data);
            setArtworkData(data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        handleArtwork();
        handleMigrations();

    }, []);

    const combinedFunction = () => {
        handleEdit();
        handleArtwork();
        // Add more functions as needed
    };


    const items2 = artworkData.map((item: Artwork) => (
        <Link legacyBehavior href={`/dashboard`} prefetch={false} key={item.idartwork}>
            <a>
                <Menu.Item onClick={() => handleMenuItemClick2(item)}>
                    {" Id: "}
                    {item.idartwork}
                    {" Title: "}
                    {item.title}
                </Menu.Item>
            </a>
        </Link>
    ));



    // Handle submit for adding artwork
    const handleEdit = () => {
        console.log("Form submitted");
        // if (!selected) {
        //     console.error("Selected is undefined or null");
        //     return;
        // }

        const data = {
            ...formData,
            ...(uploadedFileName !== null && { uploadedFileName }),
            ...(uploadedImageBase64 !== null && { uploadedImage: uploadedImageBase64 }),

        }
        console.log("Request Page: Before sending to nextjs api");
        console.dir(data.uploadedImage);
        fetch('api/editArtwork', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Cache-Control': 'no-store',
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


    const handleDelete = () => {
        if (!selected) {
            // Handle the case where no artwork is selected
            return;
        }
        const data = {
            ...formData,

        }

        // Make a DELETE request to your API to delete the artwork
        fetch(`api/deleteArtwork`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Handle successful deletion, such as updating the UI or refreshing the artwork list
                handleArtwork();
                // Clear the form fields
                setFormData({
                    idArtwork: '',
                    title: '',
                    artist_name: '',
                    donor_name: '',
                    category: '',
                    location: '',
                    width: '',
                    height: '',
                    date_created_month: '',
                    date_created_year: '',
                    comments: '',
                    image_path: '',
                });
                setSelected('Select Piece');
                // Optionally, close the form or perform any other necessary actions
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleMigrations = () => {

        fetch('api/allMigrations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.dir(data);
            setmigrationData(data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const handleApprove = (id: number | null) => {
        // Handle approval logic
        const type = "approve";
        console.log(`Approved migration with ID: ${id}`);
        const data = {
            type: type,
            id: id
        }
        fetch('api/updateMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            body: JSON.stringify(data),
            cache: 'no-store',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                //ADD function to display form here

                // Reload the window after the PUT request is successful
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleDeny = (id: number | null) => {
        // Handle denial logic
        // Handle approval logic
        const type = "deny";
        console.log(`Denied migration with ID: ${id}`);
        const data = {
            type: type,
            id: id
        };
        console.log(data);
        fetch('api/updateMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            body: JSON.stringify(data),
            cache: 'no-store',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                //ADD function to display form here

                // Reload the window after the PUT request is successful
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };



    const cards = migrationData.map((migration: Migrations) => (
        <Card key={migration.idmove_request} p="md" radius="md" component="a" href="#" className={classes.card} >
            <Card.Section>
                <AspectRatio ratio={1080 / 900}>

                    <Image
                        src={migration.artwork.image_path.image_path}
                        height={220}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }}
                    />

                </AspectRatio>
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (migration.idmove_request ? migration.idmove_request : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Title: " + (migration.artwork.title ? migration.artwork.title : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"User: " + (migration.user.address ? migration.user.address : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Move to: " + (migration.to_location ? migration.to_location : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Comments: " + (migration.comments ? migration.comments : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Date/Time: " + (migration.time_stamp ? migration.time_stamp : '-')}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button onClick={() => handleApprove(migration.idmove_request)} style={{ backgroundColor: 'green', color: 'white' }}>
                    Approve
                </Button>
                <Button onClick={() => handleDeny(migration.idmove_request)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Deny
                </Button>
            </div>
        </Card>
    ));

    // HTML and CSS  
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
                    <Container px='lg' size='sm'>
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
                                                    Drag n drop images here to upload. We can accept any image type that is less than 30mb in size.
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
                    {/* --------------------------------------------------------------------------------------------------------- */}
                    <Container px='lg' size='sm'>
                        {isEditVisible && (
                            <form>
                                <Title
                                    order={2}
                                    size="h1"
                                    style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                                    fw={900}
                                    ta="center"
                                >
                                    Edit a New Artwork
                                </Title>
                                <Group justify="center" mt="xl">
                                    <Menu
                                        onOpen={() => setOpened(true)}
                                        onClose={() => setOpened(false)}
                                        radius="md"
                                        width="target"
                                        withinPortal
                                        trigger="hover"
                                        openDelay={100}
                                        closeDelay={400}
                                    >
                                        <Menu.Target>
                                            <UnstyledButton mt="md" className={classes.control} data-expanded={opened || undefined}>
                                                <Group gap="xs">
                                                    {/* <Image src={selected.image} width={22} height={22} /> */}
                                                    <span className={classes.label}>{selected ? selected.idartwork : 'Select piece'}</span>
                                                </Group>
                                                <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                                            </UnstyledButton>
                                        </Menu.Target>
                                        <Menu.Dropdown style={{ maxHeight: '200px', overflowY: 'auto' }}>{items2}</Menu.Dropdown>
                                    </Menu>
                                </Group>
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Title"
                                        placeholder="The Oasis"
                                        name="title"
                                        variant="filled"
                                        {...form.getInputProps('title')}
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <TextInput
                                        label="Artist Name"
                                        placeholder="Mark"
                                        name="artist_name"
                                        variant="filled"
                                        {...form.getInputProps('artist_name')}
                                        value={formData.artist_name || ''}
                                        onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                                    />
                                </SimpleGrid>

                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Category"
                                        placeholder="Photograph"
                                        name="category"
                                        variant="filled"
                                        {...form.getInputProps('category')}
                                        value={formData.category || ''}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                    <TextInput
                                        label="Location"
                                        placeholder="Palmisano"
                                        name="location"
                                        variant="filled"
                                        {...form.getInputProps('location')}
                                        value={formData.location || ''}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </SimpleGrid>
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Width"
                                        placeholder="0.000"
                                        name="width"
                                        variant="filled"
                                        {...form.getInputProps('width')}
                                        value={formData.width || ''}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                    />
                                    <TextInput
                                        label="Height"
                                        placeholder="0.000"
                                        name="height"
                                        variant="filled"
                                        {...form.getInputProps('height')}
                                        value={formData.height || ''}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </SimpleGrid>
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Date Created - Month"
                                        placeholder="MM"
                                        name="date_created_month"
                                        variant="filled"
                                        {...form.getInputProps('date_created_month')}
                                        value={formData.date_created_month || ''}
                                        onChange={(e) => setFormData({ ...formData, date_created_month: e.target.value })}
                                    />
                                    <TextInput
                                        label="Date Created - Year"
                                        placeholder="YYYY"
                                        name="date_created_year"
                                        variant="filled"
                                        {...form.getInputProps('date_created_year')}
                                        value={formData.date_created_year || ''}
                                        onChange={(e) => setFormData({ ...formData, date_created_year: e.target.value })}
                                    />
                                </SimpleGrid>
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Donor"
                                        placeholder=""
                                        name="donor_name"
                                        variant="filled"
                                        {...form.getInputProps('donor_name')}
                                        value={formData.donor_name || ''}
                                        onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
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
                                    value={formData.comments || ''}
                                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                />

                                {uploadedImages.length === 0 && (
                                    <div style={{ paddingTop: '10px' }}>
                                        <Image src={formData.image_path} />
                                    </div>
                                )}
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
                                                    Drag n drop images here to upload. We can accept any image type that is less than 30mb in size.
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

                                    <Button type="submit" size="md" onClick={combinedFunction}>
                                        Save Artwork
                                    </Button>
                                    {/* </Link> */}
                                </Group>
                                <Group justify="center" mt="xl">
                                    <Button color="red" onClick={handleDelete}>
                                        Delete Artwork
                                    </Button>
                                </Group>
                            </form>
                        )}
                    </Container>

                    {/* ------------------------------------------------------------------------------------------------------------------------------- */}
                    <Container px='lg' size='sm'>
                        {isUsersVisible && (
                            <form >
                                <Title
                                    order={2}
                                    size="h1"
                                    style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                                    fw={900}
                                    ta="center"
                                >
                                    Manage Users
                                </Title>
                                <Group justify="center" mt="xl">
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" >
                                        <TextInput
                                            label="Email Address"
                                            placeholder="casem@merrimack.edu"
                                            name="address"
                                            variant="filled"
                                            {...formUser.getInputProps('address')}
                                        />


                                        <Menu
                                            onOpen={() => setOpened(true)}
                                            onClose={() => setOpened(false)}
                                            radius="md"
                                            width="target"
                                            withinPortal
                                            trigger="hover"
                                            openDelay={100}
                                            closeDelay={400}
                                        >
                                            <Menu.Target>
                                                <UnstyledButton mt="md" className={classes.control} data-expanded={opened || undefined}>
                                                    <Group gap="xs">
                                                        {/* <Image src={selected.image} width={22} height={22} /> */}
                                                        <span className={classes.label}>{selectedPrivilege}</span>
                                                    </Group>
                                                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                                                </UnstyledButton>
                                            </Menu.Target>
                                            <Menu.Dropdown style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {/* Map over privilegeTypes to create menu items */}
                                                {items}
                                            </Menu.Dropdown>
                                        </Menu>
                                    </SimpleGrid>
                                </Group>
                                <Group justify="center" mt="xl">
                                    {/* <Link href="/gallery" passHref> */}

                                    <Button type="submit" size="md" onClick={handleUserSubmit}>
                                        Save User
                                    </Button>
                                    {/* </Link> */}
                                </Group>
                            </form>
                        )}
                    </Container>
                    <Container px='lg' size='sm'>
                        {isMigrationsVisible && (
                            <form>
                                <Title
                                    order={2}
                                    size="h1"
                                    style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                                    fw={900}
                                    ta="center"
                                >
                                    Manage Migrations
                                </Title>
                                <Container py="xl">
                                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                                </Container>
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