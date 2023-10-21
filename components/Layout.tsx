'use client'
import type { Metadata } from 'next'
import Link from 'next/link';
import { Inter } from 'next/font/google'
import { Menu, Group, Center, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from '@/styles/HeaderMenu.module.css';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

const links = [
    { link: '/gallery', label: 'Gallery' },
    { link: '/request', label: 'Request' },
    { link: '/about', label: 'About' },
    { link: '/dashboard', label: 'Dashboard' },
    {
        link: '#2',
        label: 'Support',
        links: [
            { link: '/faq', label: 'FAQ' },
            { link: '/demo', label: 'Book a demo' },
            { link: '/forums', label: 'Forums' },
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
    
    const items = links.map((link) => {
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
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            session ? console.log(session) : console.log("No active session");
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
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
            <main>{children}</main>
        </>
    )
}
