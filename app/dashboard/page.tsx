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
import classesTwo from '@/styles/NotFoundImage.module.css';
import image from '@/public/404.svg';
import {
    IconHome2,
    IconCirclePlus,
    IconUserEdit,
    IconEdit,
    IconMailQuestion,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { DateTime } from 'luxon';
import Email from 'next-auth/providers/email';
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
    artist?: {
        artist_name: string | null;
    };
    category?: {
        category: string | null;
    };
    title?: string | null;
    date_created_month?: number | null;
    date_created_year?: number | null;
    width?: string | null;
    height?: string | null;
    donor?: string | null;
    size?: string | null;
    location?: {
        location: string | null;
    };
    comments?: string | null;
    image_path?: {
        image_path: string | null;
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
    const privilegeTypes = ['Admin', 'FS', 'Student'];
    const [selectedPrivilege, setSelectedPrivilege] = useState('Select Privilege Type');
    const openRef = useRef<() => void>(null);
    // Add images
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

    const [migrationData, setmigrationData] = useState([]);
    const [artworkData, setArtworkData] = useState([]);
    const [selected, setSelected] = useState<Artwork | string>(artworkData[0] || null);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const navigateToTestPage = () => {
        router.push('/dashboard/edit');
    };

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
        image_path: '',
        size: '',
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

    const navigateToEditPage = () => {
        router.push('/dashboard/edit');
    };
    const navigateToMigrationsPage = () => {
        router.push('/dashboard/migrations');
    };
    const navigateToUsersPage = () => {
        router.push('/dashboard/users');
    };

    const handleIconClick = (index: number) => {
        if (index === 1) {
            navigateToEditPage();
        } else if (index === 3) {
            navigateToMigrationsPage();
        } else if (index === 2) {
            navigateToUsersPage();
        }
    };
    // Toggle forms based on icon click
    // const [isFormVisible, setIsFormVisible] = useState(true);
    // const [isUsersVisible, setIsUsersVisible] = useState(false);
    // const [isEditVisible, setIsEditVisible] = useState(false);
    // const [isMigrationsVisible, setIsMigrationsVisible] = useState(false);
    // const handleIconClick = (index: number) => {
    //     if (index === 0) {
    //         setIsFormVisible(true);
    //         setIsUsersVisible(false);
    //         setIsEditVisible(false);
    //         setIsMigrationsVisible(false);
    //     } else if (index === 1) {
    //         setIsFormVisible(false);
    //         setIsEditVisible(true);
    //         setIsMigrationsVisible(false);
    //         setIsUsersVisible(false);
    //     } else if (index === 2) {
    //         setIsFormVisible(false);
    //         setIsUsersVisible(true);
    //         setIsEditVisible(false);
    //         setIsMigrationsVisible(false);
    //     } else if (index === 3) {
    //         setIsFormVisible(false);
    //         setIsUsersVisible(false);
    //         setIsEditVisible(false);
    //         setIsMigrationsVisible(true);
    //     }
    // };

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
            size: '',
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
            size: (value) => value.trim().length === 0,
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
        fetch(`http://127.0.0.1:8000/api/add-Artwork`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
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
        fetch(`http://127.0.0.1:8000/api/edit-User`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
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
            image_path: item.image_path?.image_path || '',
            size: item.size || ''
        });


        console.log(formData.image_path);


    };

    const handleArtwork = () => {
        fetch(`http://127.0.0.1:8000/api/artworks-List`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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

    const filteredItems2 = artworkData.filter((item: Artwork) =>
        (item.idartwork.toString().includes(searchTerm)) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const items2 = filteredItems2.map((item: Artwork) => (
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

    // const items2 = artworkData.map((item: Artwork) => (
    //     <Link legacyBehavior href={`/dashboard`} prefetch={false} key={item.idartwork}>
    //         <a>
    //             <Menu.Item onClick={() => handleMenuItemClick2(item)}>
    //                 {" Id: "}
    //                 {item.idartwork}
    //                 {" Title: "}
    //                 {item.title}
    //             </Menu.Item>
    //         </a>
    //     </Link>
    // ));



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
        console.dir(formData);
        fetch(`http://127.0.0.1:8000/api/edit-Artwork`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
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
        fetch(`http://127.0.0.1:8000/api/delete-Artwork`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
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
                    size: '',
                });
                setSelected('Select Piece');
                // Optionally, close the form or perform any other necessary actions
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleMigrations = () => {

        fetch(`http://127.0.0.1:8000/api/all-Migrations`, {
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
        fetch(`http://127.0.0.1:8000/api/update-Migration`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {

                //TODO function to display form here, write function for email

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
        fetch(`http://127.0.0.1:8000/api/update-Migration`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {

                //TODO function to display form here, write function for email 

                // Reload the window after the PUT request is successful
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };





    // HTML and CSS  
    return (
        <>
            {
                isFaculty || isAdmin ?
                    <Container>
                        <nav className={classes.navbar}>

                            <div className={classes.navbarMain}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {links}
                                </div>
                            </div>
                        </nav>
                        <Container px='lg' size='sm'>

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
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                    <TextInput
                                        label="Donor"
                                        placeholder=""
                                        name="donor_name"
                                        variant="filled"
                                        {...form.getInputProps('donor_name')}
                                    />
                                    <TextInput
                                        label="Size Category"
                                        placeholder="small"
                                        name="size"
                                        variant="filled"
                                        {...form.getInputProps('size')}
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

                        </Container>


                    </Container>
                    :
                    <Container className={classesTwo.root}>
                        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>

                        </SimpleGrid>
                    </Container>
            }
        </>
    );
}