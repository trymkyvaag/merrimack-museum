import Layout from '@/components/Layout'

export default function NestedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Layout>
            <main>{children}</main>
        </Layout>
    )
}