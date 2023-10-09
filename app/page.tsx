'use client'
import Image from 'next/image'
import { HeaderTabs } from '@/components/HeaderTabs';
import { HeroText } from '@/components/HeroText';
import { FooterLinks
 } from '@/components/FooterLinks';
export default function Home() {
  return (
    <main>
        <HeaderTabs />
        <HeroText/>
        <FooterLinks />
    </main>
  )
}
