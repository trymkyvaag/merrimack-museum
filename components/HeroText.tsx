import { Title, Text, Button, Container } from '@mantine/core';
import { Dots } from './Dots';
import classes from '@/styles/HeroText.module.css'
import { CardsCarousel } from './CardsCarousel';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        {/* <Title className={classes.title}>
          Automated AI{' '}
          <Text component="span" className={classes.highlight} inherit>
            code reviews
          </Text>{' '}
          for any stack
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Build more reliable software with AI companion. AI is also trained to detect lazy
            developers who do nothing and just complain on Twitter.
          </Text>
        </Container> */}

        <CardsCarousel/>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg" variant="default" color="gray" onClick={() => {}}>
            Log in
          </Button>
          <Button className={classes.control} size="lg">
            Request a piece
          </Button>
        </div>
      </div>
    </Container>
  );
}