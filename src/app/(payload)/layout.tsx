import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'
export default function Layout({children}:{children:React.ReactNode}) {return <RootLayout config={config}>{children}</RootLayout>}
