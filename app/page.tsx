'use client'
import Image from 'next/image'
import { CardsCarousel } from '@/components/CardsCarousel';

export default function Home() {
  return (
    <main>
      <div className='carousel'>
        <CardsCarousel/>
      </div>
    </main>
  )
}
