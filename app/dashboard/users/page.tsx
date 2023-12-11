'use client'

import { useEffect, useState, useRef } from 'react';
import { Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, useMantineTheme, Tooltip, rem, AspectRatio, Card, Center } from '@mantine/core';
import { IconX, IconDownload, IconCloudUpload, IconChevronDown } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser, useRequest, LinkProps } from '@/lib/types';
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

export default function About() {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const { data: session, status, update } = useSession();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [active, setActive] = useState(2);
    const privilegeTypes = ['Admin', 'FS', 'Student'];
    const [selectedPrivilege, setSelectedPrivilege] = useState('Select Privilege Type');
    const openRef = useRef<() => void>(null);
    const [isFaculty, setIsFaculty] = useState<boolean>(false);

    const [artworkData, setArtworkData] = useState([]);
    const [selected, setSelected] = useState<Artwork | string>(artworkData[0] || null);


    // Link mock data to icons
    const linksOne = mockdata.map((link, index) => (
        <NavbarLink
            isLast={0}
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => handleIconClick(index)} />
    ));
    const router = useRouter();

    const navigateToAddPage = () => {
        window.location.href = '/dashboard';

    };
    const navigateToEditPage = () => {
        router.push('/dashboard/edit');
    };
    const navigateToMigrationsPage = () => {
        router.push('/dashboard/migrations');
    };

    const handleIconClick = (index: number) => {
        if (index === 0) {
            navigateToAddPage();
        } else if (index === 1) {
            navigateToEditPage();
        } else if (index === 3) {
            navigateToMigrationsPage();
        }
    };


    // Handle adding user types to drop down (manage users page)
    const handleMenuItemClick = (item: any) => {
        setSelectedPrivilege(item);
    };

    const itemsOne = privilegeTypes.map((item) => (
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
        fetch(`http://127.0.0.1:8001/api/editUser`, {
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








    const links = [
        { link: '/gallery', label: 'Gallery', auth: null },
        { link: '/request', label: 'Request', auth: 'faculty' },
        { link: '/about', label: 'About', auth: null },
        {
            link: '/dashboard',
            label: 'Dashboard',
            auth: 'admin',
            links: [
                { link: '/dashboard/users', label: 'Users', auth: 'admin' },
                { link: '/dashboard/migratins', label: 'Migrations', auth: 'admin' },
                // Add more nested links as needed
            ],
        },
    ];

    const [token, setToken] = useState<string>('');

    const [items, setItems] = useState<React.ReactNode[]>(
        links.filter((link) => link.auth === null).map((link) => {


            return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });

        })
    );

    function convertLinkToComponent(link: LinkProps) {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                <Link href={item.link}>
                    {item.label}
                </Link></Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link legacyBehavior href={link.link}>
                <a id="link" className={classes.link}>
                    {link.label}
                </a>
            </Link>
        );
    }

    function addItemAtIndex(link: LinkProps, index: number) {
        const itemsCopy = [...items];
        itemsCopy.splice(index, 0, convertLinkToComponent(link));
        setItems(itemsCopy);
    }

    useEffect(() => {

        fetch(`http://127.0.0.1:8001/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
            body: JSON.stringify({ email: session?.user?.email }),

        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to get user permission');
            }
            return response.json();
        }).then((data) => {
            setToken(data.token);
            if (data.user_type.user_type === "Admin") {
                setIsAdmin(true);
                setItems(links.map((link) => {
                    return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
                    // if (link.links) {

                    //     return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
                    // } else {
                    //     return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
                    // }
                }));
            } else if (data.user_type.user_type == "FS") {
                setIsFaculty(true);
                links
                    .filter((link) => link.auth === 'faculty')
                    .forEach((link) => addItemAtIndex({ link: link.link, label: link.label, auth: link.auth }, items.length - 1));
            }
        }).catch(error => {
            console.log(error);
        });

    }, [session]);
















    return (
        <>

            {
                isFaculty || isAdmin ?
                    <Container>
                        <nav className={classes.navbar}>

                            <div className={classes.navbarMain}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {linksOne}
                                </div>
                            </div>
                        </nav>
                        <Container px='lg' size='sm'>

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
                                                {itemsOne}
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