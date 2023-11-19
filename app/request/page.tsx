'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UnstyledButton, Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper, useMantineTheme, Switch, Tooltip, rem } from '@mantine/core';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import { useArtwork, useArtworkImage, useRequest, useUser } from '@/lib/types';
import classes from '@/styles/Picker.module.css';
import image from '@/public/404.svg';
import classesTwo from '@/styles/NotFoundImage.module.css';
import { format } from 'date-fns';

interface StepperProps {
    active: number;
    onStepClick: (stepIndex: number) => void;
    children: React.ReactNode;
}

interface StepperStepProps {
    label: string;
    description: string;
    children: React.ReactNode;
}

interface StepperCompletedProps {
    children: React.ReactNode;
}

interface MultiStepperState {
    activeSteps: number[];
}

export default function Request() {
    const theme = useMantineTheme();
    const { data: session } = useSession();
    const { artworkImages } = useArtworkImage();
    const { user } = useUser();
    const { requests } = useRequest();
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    const [selected, setSelected] = useState(artworkImages[0] || null);
    const [activeSteps, setActiveSteps] = useState([0, 0, 0]); // One active step for each stepper

    const handleStepClick = (stepperIndex: any, stepIndex: any) => {
        const newActiveSteps = [...activeSteps];
        newActiveSteps[stepperIndex] = stepIndex;
        setActiveSteps(newActiveSteps);
    };
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleMenuItemClick = (item: any) => {
        console.log('Request page: clicked item: ');
        console.log(item);
        setSelected(item);
    };

    const items = artworkImages.map((item) => (
        <Menu.Item
            onClick={() => handleMenuItemClick(item)}
            key={item.id}
        >
            {item.id}
        </Menu.Item>
    ));

    const form = useForm({
        initialValues: {
            email: '',
            building: '',
            address: '315 Turnpike St,',
            city: 'North Andover',
            state: 'Massachusetts',
            country: 'U.S.A'
        },
        validate: {
            email: (value) => !/^\S+@\S+$/.test(value),
            building: (value) => value.trim().length === 0,
            address: (value) => value.trim().length === 0,
            city: (value) => value.trim().length === 0,
            state: (value) => value.trim().length === 0,
            country: (value) => value.trim().length === 0,
        },
    });


    const handleSubmit = () => {
        if (!selected) {
            console.error("Selected is undefined or null");
            return;
        }

        const data = {
            // "user_id": user?.id,
            "email": user?.email,
            "artwork_id": selected.artwork_data?.id,
            "artwork_title": selected.artwork_data?.title,
            "artwork_creation_date": selected.artwork_data?.creation_date,
            "artwork_description": selected.artwork_data?.description,
            "request_date": format(new Date(), 'yyyy-MM-dd'),
            "current_location_id": selected.artwork_data?.location_id,
            "current_location_name": selected.artwork_data?.location_name,
            "current_location_address": selected.artwork_data?.location_address,
            "current_location_city": selected.artwork_data?.location_city,
            "current_location_state": selected.artwork_data?.location_state,
            "current_location_country": selected.artwork_data?.location_country,
            "new_location_name": form.values.building,
            "new_location_address": form.values.address,
            "new_location_city": form.values.city,
            "new_location_state": form.values.state,
            "new_location_country": form.values.country,
            "status": "Pending"
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
            } else {
                console.log("Sent move request to backend");
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

    }, [session, selected, user]);
    return (
        <>
            {
                user?.is_admin || user?.is_faculty ?
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
                        </div>
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
                                                withAsterisk
                                                label="Email"
                                                placeholder="Your email"
                                                name="email"
                                                variant="filled"
                                                {...form.getInputProps('email')}
                                            />
                                        </SimpleGrid>

                                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                                            <TextInput
                                                label="Building"
                                                placeholder="Art Center"
                                                name="building"
                                                variant="filled"
                                                {...form.getInputProps('building')}
                                            />
                                            <TextInput
                                                label="Address"
                                                placeholder="310 Turnpike St"
                                                name="address"
                                                variant="filled"
                                                {...form.getInputProps('address')}
                                            />
                                            <TextInput
                                                label="City"
                                                placeholder="North Andover"
                                                name="city"
                                                variant="filled"
                                                {...form.getInputProps('city')}
                                            />
                                            <TextInput
                                                label="State"
                                                placeholder="Massachusetts"
                                                name="state"
                                                variant="filled"
                                                {...form.getInputProps('state')}
                                            />
                                            <TextInput
                                                label="Country"
                                                placeholder="U.S.A"
                                                name="country"
                                                variant="filled"
                                                {...form.getInputProps('country')}
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
                                                        <span className={classes.label}>{selected ? selected.id : 'Select piece'}</span>
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
                        ) : (
                            <>
                                {requests.length > 0 ? (
                                    requests.map((req) => {
                                        let stat = 1;

                                        if (req.status === 'Pending') {
                                            stat = 2;
                                        } else if (req.status === 'Approved') {
                                            stat = 3;
                                        } else if(req.status === 'Denied') {
                                            return <></>;
                                        }
                                        return (
                                            <Container py='lg' size='sm'>
                                                <Stepper active={stat}>
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
                                            </Container>
                                        )
                                    })

                                ) : (
                                    <Container className={classesTwo.root}>
                                        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                                            <Image src={image.src} className={classesTwo.mobileImage} />
                                            <div>
                                                <Title className={classesTwo.title}>Please file a request...</Title>
                                                <Text c="dimmed" size="lg">
                                                    You have no active requests.
                                                </Text>
                                            </div>
                                            <Image src={image.src} className={classesTwo.desktopImage} />
                                        </SimpleGrid>
                                    </Container>
                                )}
                            </>
                        )
                        }

                    </Container>

                    :
                    null
                    // <Container className={classesTwo.root}>
                    //     <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                    //         <Image src={image.src} className={classesTwo.mobileImage} />
                    //         <div>
                    //             <Title className={classesTwo.title}>Please sign in...</Title>
                    //             <Text c="dimmed" size="lg">
                    //                 Note: Only Faculty may request an art piece.
                    //             </Text>
                    //             {/* <Button variant="outline" size="md" mt="xl" className={classesTwo.control}>
                    //                 Get back to home page
                    //             </Button> */}
                    //         </div>
                    //         <Image src={image.src} className={classesTwo.desktopImage} />
                    //     </SimpleGrid>
                    // </Container>
            }
        </>
    )
}