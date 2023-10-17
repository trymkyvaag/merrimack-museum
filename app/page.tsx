import Link from 'next/link';
import { Container, Text, Button, Group } from '@mantine/core';
import { GithubIcon } from '@mantine/ds';
import classes from '@/styles/Home.module.css';

export default function Home() {
  return (
    <main>
      <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            Merrimack College
          </Text>{' '}
          Museum.
        </h1>

        <Text className={classes.description} color="dimmed">
          Browse, share, request.
        </Text>

        <Group className={classes.controls}>
          <Button
            component={Link}
            href='/login'
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Log in
          </Button>

          <Button
            component={Link}
            href='/gallery'
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<GithubIcon size={20} />}
          >
            Browse
          </Button>
        </Group>
      </Container>
    </div>
    </main>
  )
}
