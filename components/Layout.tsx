'use client'

import type { Metadata } from 'next'
import Link from 'next/link';
import { Inter } from 'next/font/google'
import { Menu, Group, Center, Burger, Container, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from '@/styles/HeaderMenu.module.css';

import { RequestType, RequestContext, useRequest, ArtworkType, ArtworkContext, ArtworkImageType, ArtworkImageContext, UserContext, useArtwork, LinkProps, UserType, useUser } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });
const imagePaths: string[] = [];

const links = [
    { link: '/gallery', label: 'Gallery', auth: null },
    { link: '/request', label: 'Request', auth: 'faculty' },
    { link: '/about', label: 'About', auth: null },
    { link: '/dashboard', label: 'Dashboard', auth: 'admin' },
    {
        link: '#2',
        label: 'Support',
        auth: null,
        links: [
            { link: '/faq', label: 'FAQ', auth: null },
            { link: '/demo', label: 'Book a demo', auth: null },
            { link: '/forums', label: 'Forums', auth: null },
        ],
    },
];

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [opened, { toggle }] = useDisclosure(false);
    const { data: session, status, update } = useSession();
    const [user, setUser] = useState<UserType | null>(null);
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [artworks, setArtworks] = useState<ArtworkType[]>([]);
    const [artworkImages, setArtworkImages] = useState<ArtworkImageType[]>([]);
    const addArtwork = (newArtwork: ArtworkType) => {
        setArtworks((prevArtwork) => [...prevArtwork, newArtwork]);
    };

    const addArtworkImage = (newArtworkImage: ArtworkImageType) => {
        setArtworkImages((prevArtworkImages) => [...prevArtworkImages, newArtworkImage])
    };

    const addRequest = (newRequest: RequestType) => {
        setRequests((prevRequests) => [...prevRequests, newRequest]);
    }

    const [items, setItems] = useState<React.ReactNode[]>(
        links.filter((link) => link.auth === null).map((link) => {
            if (link.links) {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
            } else {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
            }
        })
    );

    function convertLinkToComponent(link: LinkProps) {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
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

    const fetchUserData = async (email: string) => {
        try {
            const response = await fetch(`api/user/?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get User');
            }

            const data = await response.json();
            console.log('Backend user response: ', data);
            setUser(data);

            if (data?.is_admin) {
                setItems(
                    links.map((link) => {
                        if (link.links) {
                            return convertLinkToComponent({
                                link: link.link,
                                label: link.label,
                                auth: link.auth,
                                links: link.links,
                            });
                        } else {
                            return convertLinkToComponent({
                                link: link.link,
                                label: link.label,
                                auth: link.auth,
                            });
                        }
                    })
                );
            } else if (data.is_faculty) {
                links
                    .filter((link) => link.auth === 'faculty')
                    .forEach((link) =>
                        addItemAtIndex(
                            {
                                link: link.link,
                                label: link.label,
                                auth: link.auth,
                            },
                            items.length - 1
                        )
                    );
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchArtworkImages = async () => {
        try {
            const response = await fetch('api/images', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Artwork Images data: ', data);
            setArtworkImages(data);
        } catch (error) {
            console.error('Error fetching artwork images:', error);
        }
    };

    const fetchMoveRequests = async (email: string) => {
        try {
            const response = await fetch(`api/moverequests/?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Move Request Backend data:', data);
            setRequests(data);
        } catch (error) {
            console.error('Error fetching move requests:', error);
        }
    };


    useEffect(() => {

        const userEmail = session?.user?.email as string;

        const fetchData = async () => {
            await fetchUserData(userEmail);
            await fetchArtworkImages();
            await fetchMoveRequests(userEmail);
        };

        fetchData();

    }, [session]);

    return (
        <>
            <header className={classes.header}>
                <Container size="md">
                    <div className={classes.inner}>
                        <Link legacyBehavior href="/">
                            <a>
                                <MantineLogo size={28} />
                            </a>
                        </Link>
                        <Group gap={5} visibleFrom="sm">
                            {items}
                        </Group>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    </div>
                </Container>
            </header>
            <main>
                <ArtworkImageContext.Provider value={{ artworkImages, addArtworkImage }}>
                    <ArtworkContext.Provider value={{ artworks, addArtwork }}>
                        <UserContext.Provider value={{ user, setUser }}>
                            <RequestContext.Provider value={{ requests, addRequest }}>
                                {children}
                            </RequestContext.Provider>
                        </UserContext.Provider>
                    </ArtworkContext.Provider>
                </ArtworkImageContext.Provider>

            </main>
        </>
    );
}
