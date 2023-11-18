'use client'

import type { Metadata } from 'next'
import Link from 'next/link';
import { Inter } from 'next/font/google'
import { Menu, Group, Center, Burger, Container, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from '@/styles/HeaderMenu.module.css';

import { RequestType, RequestContext, useRequest, ArtworkType, ArtworkContext, UserContext, useArtwork, LinkProps, useUser } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });
const imagePaths: string[] = [];

const links = [
    { link: '/gallery', label: 'Gallery', auth: null },
    { link: '/request', label: 'Request', auth: 'faculty' },
    { link: '/about', label: 'About', auth: null },
    { link: '/dashboard', label: 'Dashboard', auth: 'admin' },
];

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [opened, { toggle }] = useDisclosure(false);
    const { data: session, status, update } = useSession();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isFaculty, setIsFaculty] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [request, setRequest] = useState<RequestType | null>(null);
    const [artworks, setArtworks] = useState<ArtworkType[]>([]);
    const [artworksMap, setArtworksMap] = useState<Map<number, ArtworkType[]>>(new Map());
    const addArtwork = (newArtwork: ArtworkType) => {
        setArtworks((prevArtwork) => [...prevArtwork, newArtwork]);
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

        fetch('api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session?.user?.email }),

        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to get user permission');
            }
            return response.json();
        }).then((data) => {
            setToken(data.token);
            if (data.user_type.user_type === "admin") {
                setIsAdmin(true);
                setItems(links.map((link) => {
                    if (link.links) {
                        return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
                    } else {
                        return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
                    }
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



        fetch('api/artworksList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            setArtworks(data);
            artworks.forEach((artwork) => {
                if (!artworksMap.has(artwork.idartwork)) {
                    artworksMap.set(artwork.idartwork, []);
                }
                artworksMap.get(artwork.idartwork)?.push(artwork);
            });
        }).catch(error => {
            console.error('Error:', error);
        });

        fetch('api/findrequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ address: session?.user?.email }),
            body: JSON.stringify({ address: "casem@merrimack.edu" }),
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            setRequest(data)
        }).catch(error => {
            console.error('Error:', error);
        });

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
                <ArtworkContext.Provider value={{ artworks, artworksMap, addArtwork, setArtworksMap }}>
                    <UserContext.Provider value={{ isAdmin, isFaculty, setIsAdmin, setIsFaculty }}>
                        <RequestContext.Provider value={{ request, setRequest }}>
                            {children}
                        </RequestContext.Provider>
                    </UserContext.Provider>
                </ArtworkContext.Provider>

            </main>
        </>
    );
}
