import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <MantineProvider>
                {children}
            </MantineProvider>
        </>
    )
}