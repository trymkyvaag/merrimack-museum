'use client'

import { useState } from 'react';
import Link from 'next/link';
import { UnstyledButton, Text, TextInput, Textarea, SimpleGrid, Menu, Image, Group, Title, Button, Container, Stepper } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import classes from '@/styles/Picker.module.css';

import { request_mock_data } from '@/lib/utils';

export default function Request() {
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState(request_mock_data[0]);
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const items = request_mock_data.map((item) => (
        <Menu.Item
            // leftSection={<Image src={item.image} width={18} height={18} />}
            onClick={() => setSelected(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            source: '',
            destination: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value) => value.trim().length < 2,
            email: (value) => !/^\S+@\S+$/.test(value),
            subject: (value) => value.trim().length === 0,  // Make sure to add validators for source and destination
        },
    });

    const handleSubmit = () => {

    };

    return (
        <>
            <Container px='lg' py='lg' size='sm'>
                <form onSubmit={form.onSubmit(() => { })}>
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
                            label="Name"
                            placeholder="Your name"
                            name="name"
                            variant="filled"
                            {...form.getInputProps('name')}
                        />
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

                    {/* <TextInput
                        label="Subject"
                        placeholder="Subject"
                        mt="md"
                        name="subject"
                        variant="filled"
                        {...form.getInputProps('subject')}
                    /> */}

                    <Menu
                        onOpen={() => setOpened(true)}
                        onClose={() => setOpened(false)}
                        radius="md"
                        width="target"
                        withinPortal
                    >
                        <Menu.Target>
                            <UnstyledButton mt="md" className={classes.control} data-expanded={opened || undefined}>
                                <Group gap="xs">
                                    {/* <Image src={selected.image} width={22} height={22} /> */}
                                    <span className={classes.label}>{selected.label}</span>
                                </Group>
                                <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>{items}</Menu.Dropdown>
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
                        <Button type="submit" size="md" onSubmit={() => handleSubmit}>
                            Submit Request
                        </Button>
                        {/* </Link> */}
                    </Group>
                </form>
            </Container>

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
        </>
    )
}