'use client'

import { useState, useEffect, SetStateAction } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, Input, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp, IconStar } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { useWindowScroll } from '@mantine/hooks';
import { mockdata, carousel_images } from '@/lib/utils';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';
import { Artwork, ArtworkContext } from '@/lib/types';


// console.log("Inside page.tsx!!");
// console.log(imagePaths); // Access the constant from File1


export default function Gallery() {
    const [scroll, scrollTo] = useWindowScroll();
    const [value, setValue] = useState('Clear me');
    const [artworkData, setArtworkData] = useState<Artwork[]>([]);

    useEffect(() => {
        fetch('api/artworks', {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setArtworkData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array to fetch data once when the component mounts

    const slides = carousel_images.map((image, index) => (
        <Carousel.Slide key={index}>
            <AspectRatio ratio={1920 / 1080}>
                <Image src={image} height={220} />
            </AspectRatio>
        </Carousel.Slide>
    ));

    const cards = artworkData.map((artwork) => (
        <Card key={artwork.idartwork} p="md" radius="md" component="a" href="#" className={classes.card}>
            <Card.Section>
                <Image src={artwork.image_path.image_path} height={220} />
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Img path: " + (artwork.image_path.image_path ? artwork.image_path.image_path : '-')}
            </Text>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (artwork.idartwork ? artwork.idartwork : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Artist Name: " + (artwork.artist ? artwork.artist.artist_name : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Category: " + (artwork.category ? artwork.category.category : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"MM/YYYY: " + (artwork.date_created_month && artwork.date_created_year ? `${artwork.date_created_month}/${artwork.date_created_year}` : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Width X Height: " + (artwork.width && artwork.height ? `${artwork.width}/${artwork.height}` : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Donor Name: " + (artwork.donor ? artwork.donor : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Location: " + (artwork.location ? artwork.location.location : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Comments: " + (artwork.comments ? artwork.comments : '-')}
            </Text>
        </Card>
    ));

    return (
        <>
            <main>
                <Container pt="xl" size="xs">
                    <Input
                        placeholder="Search artwork"
                        onChange={(event: { currentTarget: { value: SetStateAction<string>; }; }) => setValue(event.currentTarget.value)}
                        rightSectionPointerEvents="all"
                        rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} />}
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    )
}