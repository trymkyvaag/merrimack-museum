'use client'

import { Select } from '@mantine/core';
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
    const [scrollToValue, setScrollToValue] = useState(10);


    useEffect(() => {
        // Contact front end server (api/artworks/route.ts)
        // Make the fetch request with the selected value
        fetch('api/artworks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(10),
        })

            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setArtworkData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    }, []); // Empty dependency array to fetch data once when the component mounts

    const cards = artworkData.map((artwork) => (
        <Card key={artwork.idartwork} p="md" radius="md" component="a" href="#" className={classes.card}>
            <Card.Section>
                <Image src={artwork.image_path.image_path} height={220} />
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (artwork.idartwork ? artwork.idartwork : '-')}
            </Text>
            <Text className={classes.title} mt={5} >
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
                        onChange={(event: { currentTarget: { value: SetStateAction<string> } }) =>
                            setValue(event.currentTarget.value)
                        }
                        rightSectionPointerEvents="all"
                        rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} />}
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Select
                        data={['10', '20', '30', '40', '50']}
                        value={scrollToValue.toString()}
                        style={{ width: '75px' }}
                        onChange={(selectedValue: string | null) => {
                            if (selectedValue !== null) {
                                setScrollToValue(parseInt(selectedValue, 10));

                                // Make the fetch request with the selected value
                                fetch('api/artworks', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },

                                    body: JSON.stringify( scrollToValue ),
                                })

                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Failed to fetch data');
                                        }
                                        return response.json();
                                    })
                                    .then((data) => {
                                        console.log(data);
                                        setArtworkData(data);
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching data:', error);
                                    });

                            }
                        }}

                    />
                    <Transition transition="slide-up" mounted={scroll.y > 0}>
                        {(transitionStyles) => (
                            <Button
                                leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                                style={transitionStyles}
                                onClick={() => scrollTo({ y: scrollToValue })}

                            >
                                Scroll to top
                            </Button>
                        )}
                    </Transition>
                </div>
            </Affix>
        </>
    );
}