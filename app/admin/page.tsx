'use client'
import React from 'react'
import { HeaderTabs } from '@/components/HeaderTabs'
import { TableSelection } from '@/components/TableSelection'
import { FooterLinks } from '@/components/FooterLinks'

export default function Admin() {
  return (
    <>
        <HeaderTabs />
        <TableSelection/>
        <FooterLinks />
    </>
  )
}
