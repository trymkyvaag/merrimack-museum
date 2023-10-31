'use client'

import { Container, Grid, SimpleGrid, Skeleton, rem, Table, ScrollArea, Checkbox, Group, Avatar, Text } from '@mantine/core';
import cx from 'clsx';
import { useState } from 'react';
import { table_mock_data } from '@/lib/utils';
import classes from '@/styles/Table.module.css';


const PRIMARY_COL_HEIGHT = rem(window.innerHeight || document.documentElement.clientHeight);

export default function Dashboard() {
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    const [selection, setSelection] = useState(['1']);
    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === table_mock_data.length ? [] : table_mock_data.map((item) => item.id)));

    const rows = table_mock_data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar size={26} src={item.avatar} radius={26} />
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{item.email}</Table.Td>
                <Table.Td>{item.job}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <>
            <Container fluid my="md">
                <SimpleGrid cols={{ base: 1/*, sm: 2*/ }} spacing="md">
                    {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}
                    <ScrollArea>
                        <Table miw={800} verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: rem(40) }}>
                                        <Checkbox
                                            onChange={toggleAll}
                                            checked={selection.length === table_mock_data.length}
                                            indeterminate={selection.length > 0 && selection.length !== table_mock_data.length}
                                        />
                                    </Table.Th>
                                    <Table.Th>User</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Job</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                    <Grid gutter="md">
                        <Grid.Col>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                    </Grid>
                </SimpleGrid>
            </Container>
        </>
    );
}