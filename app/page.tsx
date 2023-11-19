import Link from 'next/link';
import { Container, Text, Button, Group } from '@mantine/core';
import { IconAlbum } from '@tabler/icons-react';
import classes from '@/styles/Home.module.css';
import LogInButton from '@/components/LogInButton';

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

          <Text className={classes.description} data-color="dimmed">
            Welcome to the Merrimack Museum – where the past meets the present, and every exhibit is a brushstroke in the masterpiece of knowledge.
          </Text>

          <Group className={classes.controls}>
            <LogInButton />
            <Button
              component={Link}
              href='/gallery'
              size="xl"
              variant="default"
              className={classes.control}
              leftSection={<IconAlbum size={20} />}
            >
              Browse
            </Button>
          </Group>
        </Container>
      </div>
    </main>
  )
}
