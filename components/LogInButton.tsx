'use client'

import Link from 'next/link';
import { Container, Text, Button, Group } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import classes from './LogInButton.module.css';

const LogInButton = () => {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={() => signOut()}
            >
                Log Out
            </Button>
        )
    }

    return (
        <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={() => signIn()}
        >
            Log In 
        </Button>
    )
}

export default LogInButton;