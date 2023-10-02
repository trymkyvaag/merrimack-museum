'use client'
import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import Head from 'next/head';
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { HeaderTabs } from '@/components/HeaderTabs';
import { FooterLinks } from '@/components/FooterLinks';

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <HeaderTabs />
            {children}
          <FooterLinks />
        </MantineProvider>
      </body>
    </html>
  )
}
