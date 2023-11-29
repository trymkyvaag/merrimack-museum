'use client'

import { Container, Text, Button, Group } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';

import classes from '@/styles/LogInButton.module.css';

const LogInButton = () => {
    const { data: session } = useSession();

    const commonButtonProps = {
        size: "xl",
        className: classes.control,
        variant: "gradient",
        gradient: { from: 'blue', to: 'cyan' },
    };

    if (session && session.user) {
        return (
            <div suppressHydrationWarning id='HomePageLogButton'>
                <Button
                    {...commonButtonProps}
                    onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
                >
                    Log Out
                </Button>
            </div>
        );
    }

    return (
        <div suppressHydrationWarning id='HomePageLogButton'>
            <Button
                {...commonButtonProps}
                onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/gallery' })}
            >
                Log In
            </Button>
        </div>
    );
};

export default LogInButton;