'use client';

import { ActionIcon, Badge, Group, Modal, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Input, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp, IconHeart } from '@tabler/icons-react';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';
import { ArtworkImageType, useArtworkImage } from '@/lib/types';
import { modal_mockdata } from '@/lib/utils';

const sectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const imageStyle = {
    width: '75%', // Image takes 75% of the section width
    marginRight: '16px', // Adjust spacing as needed
};


export default function Gallery() {
    const [value, setValue] = useState('');
    const { artworkImages, addArtworkImage } = useArtworkImage();
    const [filteredArtworkImages, setFilteredArworkImages] = useState<ArtworkImageType[]>(artworkImages);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [scrollToValue, setScrollToValue] = useState(10);
    const [scroll, scrollTo] = useWindowScroll();
    const [selectedArtwork, setSelectedArtwork] = useState<ArtworkImageType | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [noTransitionOpened, setNoTransitionOpened] = useState(false);
    const [slowTransitionOpened, setSlowTransitionOpened] = useState(false);
    const { image, title, description, country, badges } = modal_mockdata;

    const features = badges.map((badge) => (
        <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
            {badge.label}
        </Badge>
    ));

    function filterArtworks(artworks: ArtworkImageType[], searchTerm: string): ArtworkImageType[] {
        const lowercaseSearch = searchTerm.toLowerCase();

        console.log("Search Term");
        console.log(lowercaseSearch);
        return artworkImages.filter((artwork) => {
            if (artwork.artwork_data) {
                console.log("Artwork awrtwork data for search");
                console.log(artwork.artwork_data);
                return Object.values(artwork.artwork_data).some(
                    (value) => typeof value === 'string' && value.toLowerCase().includes(lowercaseSearch)
                );
            }
            return false;
        });
    }

    /**
     * Function for handeling the search 
     * @param searchValue, a string where words are separated by spaces 
     */
    const handleSearch = (searchValue: string) => {
        // setFilteredArworkImages((prevArtworkImages) =>
        //     filterArtworks(prevArtworkImages, searchValue)
        // );
        setSearchTerm(searchValue);
        if (searchValue.trim() === '') {
            // Reset filteredArtworkImages to an empty array
            setFilteredArworkImages([]);
        } else {
            // Perform filtering when searchValue is not empty
            setFilteredArworkImages((prevArtworkImages) =>
                filterArtworks(prevArtworkImages, searchValue)
            );
        }
    };

    const handleCardClick = (artwork: ArtworkImageType) => {
        open();
        setSelectedArtwork(artwork);
    };

    const cards = (filteredArtworkImages.length > 0 ? filteredArtworkImages : artworkImages).map((artwork: ArtworkImageType) => (
        <Card key={artwork.id} p="md" radius="md" component="a" href="#" className={classes.card} onClick={() => handleCardClick(artwork)}>
            <Card.Section>
                <AspectRatio ratio={1080 / 900}>
                    <Image
                        src={artwork.image_file}
                        height={220}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }}
                    />
                </AspectRatio>
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (artwork.id ? artwork.id : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {(artwork.artwork_data?.title ? artwork.artwork_data.title : '-')}
            </Text>
        </Card>
    ));

    useEffect(() => {
        // setFilteredArworkImages(artworkImages);
        console.log("Filtered artwork images");
        console.log(filteredArtworkImages);
    }, [filteredArtworkImages]);

    return (
        <>
            <main>
                <Container pt="xl" size="xs">
                    <Input
                        placeholder="Search artwork"
                        onChange={(event) => setValue(event.currentTarget.value)}
                        onKeyDown={(event) => {

                            //Call handleSearch to display works corresponding to keywords
                            if (event.key === 'Enter') {
                                handleSearch(value);
                            }
                        }}
                        rightSectionPointerEvents="all"
                        rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} onClick={() => handleSearch(value)} />}
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
                <Modal
                    opened={opened}
                    onClose={close}
                    withCloseButton={false}
                    centered
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}

                >
                    <div style={sectionStyle}>
                        <img
                            src="@/public/404.svg" // Replace with your image URL
                            alt="Your Alt Text"
                            style={imageStyle}
                        />
                        <div>
                            <p>
                                Your text goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </div>
                    </div>
                </Modal>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
