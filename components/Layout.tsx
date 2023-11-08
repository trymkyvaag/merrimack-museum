'use client'

import type { Metadata } from 'next'
import Link from 'next/link';
import { Inter } from 'next/font/google'
import { Menu, Group, Center, Burger, Container, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import { DjangoImage, LinkProps } from '@/lib/types';
import classes from '@/styles/HeaderMenu.module.css';

import { Artwork, ArtworkContext } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import fs from 'fs';



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
    const [token, setToken] = useState<string>('');
    const [artwork, setArtwork] = useState<Artwork[]>([]);
    const [map, setMap] = useState<Map<string, DjangoImage[]>>(new Map());
    const [imageUrls, setImageUrls] = useState<DjangoImage[]>([]);
    const addArtwork = (newArtwork: Artwork) => {
        setArtwork((prevArtwork) => [...prevArtwork, newArtwork]);
    };
    const [items, setItems] = useState<React.ReactNode[]>(
        links.filter((link) => link.auth === null).map((link) => {
            if (link.links) {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
            } else {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
            }
        })
    );


    const fetchRandomArtwork = (count = 5) => {
        fetch('http://localhost:8000/api/randomartwork/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ num_artworks: count }), // Send the count as JSON in the request body
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch random artwork');
                }
                return response.json();
            })
            .then((data) => {
                const newImagePaths: string[] = data.map((item: { image_path: string }) => item.image_path);
                imagePaths.length = 0; // Clear the existing array
                imagePaths.push(...newImagePaths);
                console.log(data);
                console.log(imagePaths);


                const imageUrls: string[] = imagePaths
                    .map((directoryPath) => {
                        const files = fs.readdirSync(directoryPath);
                        const imageFile = files.find((file) => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
                        if (imageFile) {
                            return `${directoryPath}/${imageFile}`;
                        }
                        return null; // No image found in the directory
                    })
                    .filter((url) => url !== null) as string[];



                console.log(imageUrls);

                // You can update your state or do other processing here
            })
            .catch((error) => {
                console.error('Error fetching random artwork:', error);
            });
    };

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

    useEffect(() => {
        if (session && session.user) {
            console.log(session.user.email);
        }
        if (session && session.user) {
            fetch('http://localhost:8000/api/add-or-check-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: session.user.email }),

                //body: JSON.stringify({ email: 'julie69@example.com' }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch authentication token');
                }
                return response.json();
            }).then((data) => {
                console.log(data)
                setToken(data.token);
                if (data.user_type.user_type === "admin") {
                    setItems(links.map((link) => {
                        return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
                    }));
                } else if (data.user_type.user_type == "FS") {
                    links
                        .filter((link) => link.auth === 'faculty')
                        .forEach((link) => addItemAtIndex({ link: link.link, label: link.label, auth: link.auth }, items.length - 1));
                }




            }).catch(error => {
                console.log(error);
            });
            console.log("MADE IT TO FETCH");
            fetchRandomArtwork();

        }
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
                <ArtworkContext.Provider value={{ artwork, map, addArtwork, setMap }}>
                    {children}
                </ArtworkContext.Provider>
            </main>
        </>
    )
}
