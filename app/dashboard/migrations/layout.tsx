import Layout from '@/components/Layout'

export default function NestedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <main>{children}</main>

  )
}