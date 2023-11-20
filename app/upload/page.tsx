'use client'

import { useRef, useState } from 'react';
import { Text, Group, Button, rem, useMantineTheme, Container } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from '@/styles/Dropzone.module.css';

export default function Upload() {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

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
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
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
                        Drag n drop images here to upload. We can accept any image type that is less than 30mb in size.
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
    );
}