'use client'

import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';
import { mockdata } from '@/lib/utils';
import classes from '@/styles/Gallery.module.css';

export default function Gallery() {
    const [scroll, scrollTo] = useWindowScroll();
    const cards = mockdata.map((article) => (
        <Card key={article.title} p="md" radius="md" component="a" href="#" className={classes.card}>
            <AspectRatio ratio={1920 / 1080}>
                <Image src={article.image} />
            </AspectRatio>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {article.date}
            </Text>
            <Text className={classes.title} mt={5}>
                {article.title}
            </Text>
        </Card>
    ));

    const optionsFilter: OptionsFilter = ({ options, search }) => {
        const splittedSearch = search.toLowerCase().trim().split(' ');
        return (options as ComboboxItem[]).filter((option) => {
            const words = option.label.toLowerCase().trim().split(' ');
            return splittedSearch.every((searchWord) => words.some((word) => word.includes(searchWord)));
        });
    };

    return (
        <>
            <main>
                    <Container pt="xl" size="xs">
                        <Autocomplete
                            rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} />}
                            placeholder='Search artwork...'
                            data={['Mickey Mouse', 'Lady Liberty', 'Eiffel Tower']}
                            filter={optionsFilter}
                            limit={3}
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