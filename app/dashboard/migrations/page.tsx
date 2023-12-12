'use client'

import { useEffect, useState, useRef } from 'react';
import { Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, useMantineTheme, Tooltip, rem, AspectRatio, Card, Input, Modal } from '@mantine/core';
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
    size?: string | null;
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
    is_complete: boolean;
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
    const [migrationDataA, setmigrationDataA] = useState([]);
    const [artworkData, setArtworkData] = useState([]);
    const [selected, setSelected] = useState<Artwork | string>(artworkData[0] || null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const navigateToAddPage = () => {
        window.location.href = '/dashboard';
    };
    const navigateToEditPage = () => {
        router.push('/dashboard/edit');
    };
    const navigateToUsersPage = () => {
        router.push('/dashboard/users');
    };

    const handleIconClick = (index: number) => {
        if (index === 0) {
            navigateToAddPage();
        } else if (index === 1) {
            navigateToEditPage();
        } else if (index === 2) {
            navigateToUsersPage();
        }
    };


    // Link mock data to icons
    const links = mockdata.map((link, index) => (
        <NavbarLink
            isLast={0}
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => handleIconClick(index)} />
    ));

    const handleMigrations = () => {

        fetch('http://127.0.0.1:8001/api/allMigrations', {
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
            setmigrationData(data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const handleMigrationsA = () => {

        fetch('http://127.0.0.1:8001/api/approvedMigrations', {
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
            console.dir("Approved");
            console.dir(data);
            setmigrationDataA(data);

        }).catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        handleMigrations();
        handleMigrationsA();
        // console.log("here");
        console.log(migrationData);
    }, []);

    const handleApprove = (id: number | null) => {

        // Handle approval logic
        const type = "approve";
        console.log(`Approved migration with ID: ${id}`);
        const data = {
            type: type,
            id: id
        }
        fetch('http://127.0.0.1:8001/api/updateMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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
                window.location.reload();
                //TODO function to display form here, write function for email

                // Reload the window after the PUT request is successful

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
        fetch('http://127.0.0.1:8001/api/updateMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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
        handleContactUsClick();

    };

    const handleComplete = (id: number | null, location: string, idArtwork: number | null) => {
        // Handle approval logic
        const type = "complete";
        console.log(`Approved migration with ID: ${id}`);
        const data = {
            type: type,
            id: id,
            location: location,
            idArtwork: idArtwork
        }
        fetch('http://127.0.0.1:8001/api/completeMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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

    const handleSendBack = (id: number | null) => {
        // Handle denial logic
        // Handle approval logic
        const type = "sendback";
        console.log(`Denied migration with ID: ${id}`);
        const data = {
            type: type,
            id: id
        };
        console.log(data);
        fetch('http://127.0.0.1:8001/api/completeMigration', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
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

    const [contactUsModalOpen, setContactUsModalOpen] = useState(false);

    const [emailSent, setemailSent] = useState(false);
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


    class DateTime {
        constructor(public timestamp: number) { }
    }

    function isDateTime(value: any): value is DateTime {
        return value instanceof DateTime;
    }

    function formatDateTime(dateTimeString: DateTime | boolean | string | number) {
        if (typeof dateTimeString === 'boolean') {
            return 'Invalid Date';
        }

        let dateValue: Date;

        if (isDateTime(dateTimeString)) {
            dateValue = new Date(dateTimeString.timestamp);
        } else {
            // Handle the case when dateTimeString is string or number
            dateValue = new Date(dateTimeString);
        }

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        return dateValue.toLocaleString();
    }



    const cards = migrationData.map((migration: Migrations) => (
        <Card key={migration.idmove_request} p="md" radius="md" component="a" href="#" className={classes.card} style={{ width: '300px' }} >
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
            <Text style={{ fontWeight: 'bold' }} c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (migration.idmove_request ? migration.idmove_request : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Title: " + (migration.artwork.title ? migration.artwork.title : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"User: " + (migration.user.address ? migration.user.address : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Move to: " + (migration.to_location ? migration.to_location : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Comments: " + (migration.comments ? migration.comments : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Date/Time: " + (migration.time_stamp ? formatDateTime(migration.time_stamp as unknown as DateTime) : '-')}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button onClick={() => handleApprove(migration.idmove_request)} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
                    Approve
                </Button>
                <Button onClick={() => handleDeny(migration.idmove_request)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Deny
                </Button>
            </div>
        </Card>
    ));

    const approvedCards = migrationDataA.map((migrations: Migrations) => (
        <Card key={migrations.idmove_request} p="md" radius="md" component="a" href="#" className={classes.card} style={{ width: '300px' }}>
            <Card.Section>
                <AspectRatio ratio={1080 / 900}>

                    <Image
                        src={migrations.artwork.image_path.image_path}
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
                {"Identifier: " + (migrations.idmove_request ? migrations.idmove_request : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Title: " + (migrations.artwork.title ? migrations.artwork.title : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"User: " + (migrations.user.address ? migrations.user.address : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Move to: " + (migrations.to_location ? migrations.to_location : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Comments: " + (migrations.comments ? migrations.comments : '-')}
            </Text>
            <Text style={{ fontWeight: 'bold' }} className={classes.title} mt={5}>
                {"Date/Time: " + (migrations.time_stamp ? formatDateTime(migrations.time_stamp as unknown as DateTime) : '-')}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button onClick={() => handleComplete(migrations.idmove_request, migrations.to_location, migrations.artwork.idartwork)} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
                    Complete
                </Button>
                <Button onClick={() => handleSendBack(migrations.idmove_request)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Back
                </Button>
            </div>
        </Card>
    ));



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
                                    value={emailForm.message}
                                    onChange={(event) => handleInputChange('message', event.currentTarget.value)}
                                    mb={10}
                                />
                                <Button onClick={() => handleSendEmail(emailForm.name, emailForm.email, emailForm.message)} fullWidth>
                                    Send Email
                                </Button>
                            </Container>
                        </Modal>

                        <Container px='lg' size='sm'>

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
                                    <Title size={25}> Pending Requests: </Title>
                                    <br></br>
                                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                                </Container>
                                <Container py="xl">
                                    <Title size={25}> Requests in Movement: </Title>
                                    <br>
                                    </br>
                                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{approvedCards}</SimpleGrid>
                                </Container>
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