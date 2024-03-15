'use client';
import './gallery.css';
import { Modal, Select } from '@mantine/core';
import { useState, useEffect, SetStateAction } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, Input, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp } from '@tabler/icons-react';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';

/**
     * Use interface to avoid tsx errors when declaring cards
     */
interface Artwork {
    idartwork: number;
    artist: {
        artist_name: string | null;
    };
    category?: {
        category: string | null;
    };
    title: string | null;
    date_created_month?: number | null;
    date_created_year?: number | null;
    width?: string | null;
    height?: string | null;
    donor: {
        donor_name: string;
    };
    size: string | null;
    location?: {
        location: string;
    } | null;
    comments?: string | null;
    image_path: {
        image_path: string;
    };
}


export default function Gallery() {
    const [showDownloadMessage, setShowDownloadMessage] = useState(false);
    const [value, setValue] = useState('');
    const [artworkData, setArtworkData] = useState({
        status: 'loading', // Possible values: 'loading', 'noMatch', 'success'
        data: [],
    });
    const [scrollToValue, setScrollToValue] = useState(null);
    const [scroll, scrollTo] = useWindowScroll();
    const [opened, { open, close }] = useDisclosure(false);
    const [remainingData, setRemainingData] = useState([]); // State for remaining data
    const [selectedCard, setSelectedCard] = useState(null);
    /**
     * Function for handling the search 
     * @param searchValue, a string where words are separated by spaces 
     */
    const handleSearch = (searchValue: string) => {

        //fetch the frontend endpoint
        fetch(`http://127.0.0.1:8000/api/searchartwork/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
            body: JSON.stringify({ keyword: searchValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                console.log("gallery");
                console.log(data);
                if (data.length === 0) {
                    setArtworkData({ status: 'noMatch', data: [] });
                } else {
                    setArtworkData({ status: 'success', data });
                }
            })
            .catch((error) => {
                setArtworkData({ status: 'error', data: [] });
                console.error('Error fetching data:', error);
            });
    };


    /**
     * Function for handling the dropdown integer values 
     * @param num_artworks, a number from the dropdown that is a multiple of 3 
     */
    const handleCards = (num_artworks: number) => {

        fetch(`http://127.0.0.1:3000/api/searchartwork/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            cache: 'no-store',
            body: JSON.stringify(num_artworks),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setArtworkData({ status: 'success', data });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    /**
     * Function for handling the dropdown string value
     * @param all_artworks, a string from the dropdown: "All"
     */
    const handleAll = (all_artworks: string) => {
        console.log("search all");
        console.log(all_artworks);

        fetch(`http://127.0.0.1:8000/api/searchartwork/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
            cache: 'no-store',
            body: JSON.stringify(all_artworks),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    setArtworkData({ status: 'noMatch', data: [] });
                } else {
                    const randomNumber = Math.floor(Math.random() * data.length) - 29;
                    const dispData = data.slice(randomNumber, randomNumber + 30);
                    const remaining = data.slice(0, randomNumber).concat(data.slice(randomNumber + 30, data.length - 1));
                    setRemainingData(remaining); // Set remainingData state
                    setArtworkData({ status: 'success', data: dispData });
                }
            })
            .catch((error) => {
                setArtworkData({ status: 'error', data: [] });
                console.error('Error fetching data:', error);
            });
    };

    /**
     * Set inital data
     */
    useEffect(() => {
        handleAll("All");
    }, []);

    const handlePicClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // throw new Error('This is a test error!');
        const cards = document.querySelectorAll('.artwork-card');
        cards.forEach(card => {
            card.classList.remove('no-hover');
            card.classList.remove('selected');
            card.classList.add('overlay');
        });
        event.currentTarget.classList.remove('no-hover');
        event.currentTarget.classList.add('selected');
    }

    // Define a function to close the expanded card
    const closeExpandedCard = () => {
        const expandedCard = document.querySelector('.artwork-card.selected');
        if (expandedCard) {
            expandedCard.classList.remove('selected');

            document.body.classList.remove('no-scroll'); // Optionally, remove no-scroll class to enable scrolling
        }
        const cards = document.querySelectorAll('.artwork-card');
        cards.forEach(card => {
            card.classList.remove('overlay');
        });
    };

    // Add event listener to the document to close the expanded card when clicking outside of it
    document.addEventListener('click', (event) => {
        if (event.target instanceof Element && !event.target.closest('.selected')) {
            closeExpandedCard();
        }
    });

    /**
     * Create the cards. Maps the data (The artworks) to Cards
     */
    const cards = () => {
        switch (artworkData.status) {
            case 'loading':
                return (
                    <div className={classes.loaderContainer}>
                        <span className={`loader ${classes.loader}`} />
                    </div>
                );
            case 'noMatch':
                return <p>Nothing matched the search</p>;
            case 'success':
                return artworkData.data.map((artwork: Artwork) => (
                    <Card
                        key={artwork.idartwork}
                        p="md"
                        radius="md"
                        component="div" // Change component to 'div'
                        className="artwork-card"
                        onClick={handlePicClick} // Change the type of onClick event handler
                    >
                        <Card.Section >
                            <AspectRatio ratio={1080 / 900}>

                                <Image
                                    src={artwork.image_path.image_path}
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
                            {"Identifier: " + (artwork.idartwork ? artwork.idartwork : '-')}
                        </Text>
                        <Text className={classes.title} mt={5}>
                            {"Title: " + (artwork.title ? artwork.title : '-')}
                        </Text>
                        <Text className={classes.title} mt={5}>
                            {"Artist Name: " + (artwork.artist ? artwork.artist.artist_name : '-')}
                        </Text>
                        {/* Info to be displayed on big card */}
                        <div id="extraInfo">
                            <Text className={classes.title} mt={5}>
                                {"Category: " + (artwork.category ? artwork.category.category : '-')}
                            </Text>
                            <Text className={classes.title} mt={5}>
                                {"Size Category: " + (artwork.size ? artwork.size : '-')}
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
                                {"Donor Name: " + (artwork.donor ? artwork.donor.donor_name : '-')}
                            </Text>
                            <Text className={classes.title} mt={5}>
                                {"Location: " + (artwork.location ? artwork.location.location : '-')}
                            </Text>
                            <Text className={classes.title} mt={5}>
                                {"Comments: " + (artwork.comments ? artwork.comments : '-')}
                            </Text>
                        </div>
                    </Card>
                )); default:
                return <p>Error loading data</p>;
        }
    };

    const handleContextMenu = (event: { preventDefault: () => void; }) => {

        event.preventDefault(); // Prevent the default right-click behavior
        setShowDownloadMessage(true);
        setTimeout(() => {
            setShowDownloadMessage(false);
        }, 3000); // Hide the message after 1 second
    };



    const handleButtonClick = () => {
        setArtworkData((prevData) => {
            if (prevData.status === 'success') {
                const currentDisplayedCount = prevData.data.length;
                const nextIndex = currentDisplayedCount; // Start index for the next set of pictures (TODO: Change if time)

                if (nextIndex < remainingData.length) {
                    const nextSubset = remainingData.slice(nextIndex, nextIndex + 30);
                    const newData = prevData.data.concat(nextSubset);
                    return { status: 'success', data: newData };
                } else {
                    // All pictures have been displayed
                    return prevData;
                }
            } else {
                // Handle other statuses (e.g., 'noMatch')
                return prevData;
            }
        });
    };


    return (
        <div suppressHydrationWarning style={{ backgroundColor: '#003768' }} onContextMenu={handleContextMenu}>
            <Container pt="xl" size="xs">
                <Input
                    placeholder="Search artwork"
                    onChange={(event) => setValue(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSearch(value);
                        }
                    }}
                    rightSectionPointerEvents="all"
                    rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} onClick={() => handleSearch(value)} />}
                />
            </Container>
            <Container py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards()}</SimpleGrid>
            </Container>
            <Modal opened={opened} onClose={close} centered>
            </Modal>
            <Affix position={{ bottom: 20, right: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                    <Transition
                        transition="slide-up"
                        mounted={scroll.y > 0}
                    >
                        {(transitionStyles) => (
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: '20px', // Adjust bottom spacing as needed
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    ...transitionStyles // Include transition styles
                                }}
                            >
                                <Button onClick={handleButtonClick}>
                                    Load More
                                </Button>
                            </div>
                        )}
                    </Transition>

                </div>
            </Affix>
            {showDownloadMessage && <div className="download-message">Please do not download Artwork. If you want to use them, email us through the contact form at the about page</div>}
        </div>

    );


}