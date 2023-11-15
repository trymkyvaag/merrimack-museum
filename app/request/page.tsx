'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UnstyledButton, Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper, useMantineTheme, Switch, Tooltip, rem } from '@mantine/core';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import image from '@/public/404.svg';
import classesTwo from '@/styles/NotFoundImage.module.css';

export default function Request() {
    const { data: session, status, update } = useSession();
    const { artworks } = useArtwork();
    const { isAdmin, isFaculty } = useUser();
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const [checked, setChecked] = useState(false);
    const [selected, setSelected] = useState(artworks[0] || null);
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleMenuItemClick = (item: any) => {
        setSelected(item);
    };

    const items = artworks.map((item) => (
        <Menu.Item
            onClick={() => handleMenuItemClick(item)}
            key={item.idartwork}
        >
            {item.idartwork}
        </Menu.Item>
    ));

    const form = useForm({
        initialValues: {
            email: '',
            source: '',
            destination: '',
            message: '',
        },
        validate: {
            email: (value) => !/^\S+@\S+$/.test(value),
            source: (value) => value.trim().length === 0,
            destination: (value) => value.trim().length === 0,
        },
    });


    const handleSubmit = () => {
        if (!selected) {
            console.error("Selected is undefined or null");
            return;
        }

        const data = {
            ...form.values,
            artwork: selected
        }
        console.log("Request Page: Before sending to nextjs api");
        console.log(data)
        fetch('api/moverequests', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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

        setChecked(true);
    };

    useEffect(() => {
        if (session && session.user) {
            form.setFieldValue('email', session.user.email ?? '');
        }
    }, [session, selected]);
    return (
        <>
            {
                // || isFaculty || isAdmin
                isFaculty || isAdmin ?
                    <Container>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                            <Tooltip label="View your requests" refProp="rootRef">
                                <Switch
                                    checked={checked}
                                    onChange={(event) => setChecked(event.currentTarget.checked)}
                                    color="teal"
                                    size="md"
                                    thumbIcon={
                                        checked ? (
                                            <IconCheck
                                                style={{ width: rem(12), height: rem(12) }}
                                                color={theme.colors.teal[6]}
                                                stroke={3}
                                            />
                                        ) : (
                                            <IconX
                                                style={{ width: rem(12), height: rem(12) }}
                                                color={theme.colors.red[6]}
                                                stroke={3}
                                            />
                                        )
                                    }
                                />
                            </Tooltip>
                        </div>
                        {!checked ?
                            <Container>
                                <Container px='lg' py='lg' size='sm'>
                                    <form onSubmit={form.onSubmit(handleSubmit)}>
                                        <Title
                                            order={2}
                                            size="h1"
                                            style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                                            fw={900}
                                            ta="center"
                                        >
                                            Request a piece
                                        </Title>

                                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                            <TextInput
                                                label="Email"
                                                placeholder="Your email"
                                                name="email"
                                                variant="filled"
                                                {...form.getInputProps('email')}
                                            />
                                        </SimpleGrid>

                                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                            <TextInput
                                                label="Source"
                                                placeholder="Art Center"
                                                name="source"
                                                variant="filled"
                                                {...form.getInputProps('source')}
                                            />
                                            <TextInput
                                                label="Destination"
                                                placeholder="Obrien ..."
                                                name="destination"
                                                variant="filled"
                                                {...form.getInputProps('destination')}
                                            />
                                        </SimpleGrid>
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
                                                        <span className={classes.label}>{selected ? selected.idartwork : 'Select piece'}</span>
                                                    </Group>
                                                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                                                </UnstyledButton>
                                            </Menu.Target>
                                            <Menu.Dropdown style={{ maxHeight: '200px', overflowY: 'auto' }}>{items}</Menu.Dropdown>
                                        </Menu>
                                        <Textarea
                                            mt="md"
                                            label="Message"
                                            placeholder="Your message"
                                            maxRows={10}
                                            minRows={5}
                                            autosize
                                            name="message"
                                            variant="filled"
                                            {...form.getInputProps('message')}
                                        />

                                        <Group justify="center" mt="xl">
                                            {/* <Link href="/gallery" passHref> */}
                                            <Button type="submit" size="md" onSubmit={() => { }}>
                                                Submit Request
                                            </Button>
                                            {/* </Link> */}
                                        </Group>
                                    </form>
                                </Container>
                            </Container>
                            :
                            <Container py='lg' size='sm'>
                                <Stepper active={active} onStepClick={setActive}>
                                    <Stepper.Step label="First step" description="Request">
                                        Step 1: Submit Request
                                    </Stepper.Step>
                                    <Stepper.Step label="Second step" description="Request Review">
                                        Step 2: Request is being reviewed
                                    </Stepper.Step>
                                    <Stepper.Step label="Final step" description="Approved">
                                        Step 3: Request Approved
                                    </Stepper.Step>
                                    <Stepper.Completed>
                                        Art piece out for delivery
                                    </Stepper.Completed>
                                </Stepper>
                                <Group justify="center" mt="xl">
                                    <Button variant="default" onClick={prevStep}>Back</Button>
                                    <Button onClick={nextStep}>Next step</Button>
                                </Group>
                            </Container>
                        }
                    </Container>

                    :
                    <Container className={classesTwo.root}>
                        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                            <Image src={image.src} className={classesTwo.mobileImage} />
                            <div>
                                <Title className={classesTwo.title}>Please sign in...</Title>
                                <Text c="dimmed" size="lg">
                                    Note: Only Faculty may request an art piece.
                                </Text>
                                {/* <Button variant="outline" size="md" mt="xl" className={classesTwo.control}>
                                    Get back to home page
                                </Button> */}
                            </div>
                            <Image src={image.src} className={classesTwo.desktopImage} />
                        </SimpleGrid>
                    </Container>
            }
        </>
    )
}