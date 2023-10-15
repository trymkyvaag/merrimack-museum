'use client'
import Image from 'next/image'
import { HeaderTabs } from '@/components/HeaderTabs';
import { HeroText } from '@/components/HeroText';
import { FooterLinks } from '@/components/FooterLinks';
import { ArticlesCardsGrid } from '@/components/ArticlesCardsGrid';

export default function Admin() {
  return (
    <main>
        <HeaderTabs />
        <HeroText/>
        <ArticlesCardsGrid/>
        <FooterLinks />
    </main>
  )
}