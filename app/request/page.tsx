'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UnstyledButton, Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper, useMantineTheme, Switch, Tooltip, rem } from '@mantine/core';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useArtwork, useUser, useRequest } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import image from '@/public/404.svg';
import classesTwo from '@/styles/NotFoundImage.module.css';
import { format } from 'date-fns';

export default function Request() {
    const theme = useMantineTheme();
    const { data: session, status, update } = useSession();
    const { artworks } = useArtwork();
    const { isAdmin, isFaculty } = useUser();
    const { request } = useRequest();
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    const [selected, setSelected] = useState(artworks[0] || null);
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const [searchTerm, setSearchTerm] = useState('');

    const handleMenuItemClick = (item: any) => {
        setSelected(item);
        form.setValues({ ...form.values, source: item.location.location });
    };
    const filteredItems = artworks.filter(item =>
        (item.idartwork.toString().includes(searchTerm)) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const items = filteredItems.map((item) => (
        <Link legacyBehavior href={`/request`} prefetch={false} key={item.idartwork}>
            <a>
                <Menu.Item
                    onClick={() => handleMenuItemClick(item)}
                    key={item.idartwork}
                >
                    {" Id: "}
                    {item.idartwork}
                    {" Title: "}
                    {item.title}
                </Menu.Item>
            </a>
        </Link>

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
            artwork: selected,
            time_stamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
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

        if (request?.move_request && request.move_request.is_approved) {
            setActive(3);
        } else if (request?.move_request && request.move_request.is_pending) {
            setActive(2);
        } else {
            setActive(1);
        }
    }, [session, selected]);



    return (
        <>
            {
                // || isFaculty || isAdmin
                isFaculty || isAdmin ?
                    <Container>
                        {/* <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
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
                                            // <IconX
                                            //     style={{ width: rem(12), height: rem(12) }}
                                            //     color={theme.colors.red[6]}
                                            //     stroke={3}
                                            // />
                                            null
                                        )
                                    }
                                />
                            </Tooltip>
                        </div> */}
                        {!checked ? (
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
                                                disabled={!!(active === 2 && request?.move_request && request.move_request.is_pending)}
                                            />
                                        </SimpleGrid>

                                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                            <TextInput
                                                label="Source"
                                                placeholder="Art Center"
                                                name="source"
                                                variant="filled"
                                                {...form.getInputProps('source')}
                                                readOnly // Make the field uneditable
                                                disabled={!!(active === 2 && request?.move_request && request.move_request.is_pending)}
                                            />
                                            <TextInput
                                                label="Destination"
                                                placeholder="Obrien ..."
                                                name="destination"
                                                variant="filled"
                                                {...form.getInputProps('destination')}
                                                disabled={!!(active === 2 && request?.move_request && request.move_request.is_pending)}
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
                                            <Menu.Dropdown style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                <TextInput
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                {items}
                                            </Menu.Dropdown>
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
                                            disabled={!!(active === 2 && request?.move_request && request.move_request.is_pending)}
                                        />
                                        {active === 2 && request?.move_request?.is_pending && (
                                            <Text color="red" mt="sm">
                                                You can only request one artwork at a time.
                                            </Text>
                                        )}

                                        <Group justify="center" mt="xl">
                                            {/* <Link href="/gallery" passHref> */}
                                            <Button type="submit" size="md" onSubmit={() => { }} disabled={!!(active === 2 && request?.move_request && request.move_request.is_pending)}>
                                                Submit Request
                                            </Button>

                                            {/* </Link> */}
                                        </Group>
                                    </form>
                                </Container>
                            </Container>
                        ) : (
                            request?.move_request ? (
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
                                    {/* <Group justify="center" mt="xl">
                                        <Button variant="default" onClick={prevStep}>Back</Button>
                                        <Button onClick={nextStep}>Next step</Button>
                                    </Group> */}
                                </Container>
                            ) : (
                                <Container className={classesTwo.root}>
                                    <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                                        <Image src={image.src} className={classesTwo.mobileImage} />
                                        <div>
                                            <Title className={classesTwo.title}>Please file a request...</Title>
                                            <Text c="dimmed" size="lg">
                                                You have no active requests.
                                            </Text>
                                            {/* <Button variant="outline" size="md" mt="xl" className={classesTwo.control}>
                                    Get back to home page
                                </Button> */}
                                        </div>
                                        <Image src={image.src} className={classesTwo.desktopImage} />
                                    </SimpleGrid>
                                </Container>
                            )
                        )}

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