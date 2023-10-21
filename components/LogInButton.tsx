'use client'

import Link from 'next/link';
import { Container, Text, Button, Group } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import classes from './LogInButton.module.css';

const LogInButton = () => {
    const { data: session } = useSession();
    const router = useRouter();

    // const handleSignIn = async () => {
    //     const result = await signIn(); // Replace with your actual auth provider

    //     if (result?.error) {
    //         // Handle login error
    //         console.error('Login error:', result.error);
    //     } else if (result?.ok) {
    //         // If login was successful, you can redirect to a specific page
    //         router.push('/your-specific-page'); // Replace with the page you want to redirect to
    //     }
    // };

    if (session && session.user) {
        return (
            <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
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
            onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/gallery' })}
        >
            Log In
        </Button>
    )
}

export default LogInButton;