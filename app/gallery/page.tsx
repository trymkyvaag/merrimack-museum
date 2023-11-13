'use client';

import { Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, Input, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';
import { Artwork } from '@/lib/types';

export default function Gallery() {
    const [value, setValue] = useState('');
    const [artworkData, setArtworkData] = useState([]);
    const [scrollToValue, setScrollToValue] = useState(10);

    const [scroll, scrollTo] = useWindowScroll();

    const handleSearch = () => {
        if (value.trim() !== '') {
            // Make the fetch request with the search value
            fetch('api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: value }),
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
    };

    const handleEnterKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        // Initial fetch when component mounts
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
                <AspectRatio ratio={1080 / 900}>
                    <Image src={artwork.image_path.image_path} height={220} />
                </AspectRatio>
            </Card.Section>
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
                {"MM/YYYY: " + (artwork.date_created_month && artwork.date_created_year
                    ? `${artwork.date_created_month}/${artwork.date_created_year}`
                    : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Width X Height: " + (artwork.width && artwork.height
                    ? `${artwork.width}/${artwork.height}`
                    : '-')}
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
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        onKeyDown={handleEnterKeyPress}
                        rightSectionPointerEvents="all"
                        rightSection={
                            <IconSearch
                                style={{ width: 'rem(15)', height: 'rem(15)' }}
                                stroke={1.5}
                                onClick={handleSearch}
                            />
                        }
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* Rest of your Affix and other components */}
                </div>
            </Affix>
        </>
    );
}
