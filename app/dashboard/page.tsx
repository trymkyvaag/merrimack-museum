'use client'

import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { Container, Grid, SimpleGrid, Skeleton, rem, Table, ScrollArea, Checkbox, Group, Avatar, Text, Button, useMantineTheme } from '@mantine/core';
import cx from 'clsx';
import { useRef, useState } from 'react';
import { table_mock_data } from '@/lib/utils';
import classes from '@/styles/Dashboard.module.css';


const PRIMARY_COL_HEIGHT = typeof window !== 'undefined'
  ? rem(window.innerHeight || document.documentElement.clientHeight)
  : rem(300);

export default function Dashboard() {
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    const [selection, setSelection] = useState(['1']);
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === table_mock_data.length ? [] : table_mock_data.map((item) => item.id)));

    const rows = table_mock_data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar size={26} src={item.avatar} radius={26} />
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{item.email}</Table.Td>
                <Table.Td>{item.job}</Table.Td>
            </Table.Tr>
        );
    });



    const handleImageUpload = (files: File[]) => {
        setUploadedImages([...uploadedImages, ...files]);
    };

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);
    };

    const sendImagesToServer = () => {
        const formData = new FormData();
        uploadedImages.forEach((image, index) => {
            formData.append(`images`, image, `image${index}`);
        });

        fetch('/your-upload-url/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Images uploaded successfully');
                    // You can reset the uploadedImages state or take other actions upon successful upload
                } else {
                    console.error('Error uploading images');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    
    return (
        <>
            <Container fluid my="md">
                <SimpleGrid cols={{ base: 1/*, sm: 2*/ }} spacing="md">
                    {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}
                    <ScrollArea>
                        <Table miw={800} verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: rem(40) }}>
                                        <Checkbox
                                            onChange={toggleAll}
                                            checked={selection.length === table_mock_data.length}
                                            indeterminate={selection.length > 0 && selection.length !== table_mock_data.length}
                                        />
                                    </Table.Th>
                                    <Table.Th>User</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Job</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                    <Grid gutter="md">
                        <Grid.Col>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} /> */}

                            <div className={classes.wrapper}>
                                <Dropzone
                                    openRef={openRef}
                                    onDrop={handleImageUpload}
                                    className={classes.dropzone}
                                    radius="md"
                                    accept={['image/*']}
                                    maxSize={30 * 1024 ** 2}
                                    multiple // Enable multiple file upload
                                >
                                    <div style={{ pointerEvents: 'none' }}>
                                        <Group justify="center">
                                            <Dropzone.Accept>
                                                <IconDownload
                                                    style={{ width: rem(50), height: rem(50) }}
                                                    color={theme.colors.blue[6]}
                                                    stroke={1.5}
                                                />
                                            </Dropzone.Accept>
                                            <Dropzone.Reject>
                                                <IconX
                                                    style={{ width: rem(50), height: rem(50) }}
                                                    color={theme.colors.red[6]}
                                                    stroke={1.5}
                                                />
                                            </Dropzone.Reject>
                                            <Dropzone.Idle>
                                                <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                                            </Dropzone.Idle>
                                        </Group>

                                        <Text ta="center" fw={700} fz="lg" mt="xl">
                                            <Dropzone.Accept>Drop images here</Dropzone.Accept>
                                            <Dropzone.Reject>Images must be less than 30mb</Dropzone.Reject>
                                            <Dropzone.Idle>Upload images</Dropzone.Idle>
                                        </Text>
                                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                            Drag'n'drop images here to upload. We can accept any image type that is less than 30mb in size.
                                        </Text>
                                    </div>
                                </Dropzone>

                                {/* {uploadedImages.length > 0 && (
                <div>
                    {uploadedImages.map((image, index) => (
                        <div key={index} className={classes.imageContainer}>
                            <img src={image} alt={`Uploaded Image ${index}`} />
                            <Button
                                className={classes.removeButton}
                                size="xs"
                                variant="filled"
                                onClick={() => removeImage(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )} */}

                                <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                                    Select images
                                </Button>

                                {/* <Button className={classes.control} size="md" radius="xl" onClick={sendImagesToServer}>
                Upload Images
            </Button> */}
                            </div>
                        </Grid.Col>
                    </Grid>
                </SimpleGrid>
            </Container>
        </>
    );
}