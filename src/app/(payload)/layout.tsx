import type { Metadata } from 'next'
import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'
import { importMap } from './admin/importMap.js'
import { serverFunction } from './server-function'

/** FR-08：后台不对搜索引擎开放（robots.txt 另外屏蔽 /admin 与 /api） */
export const metadata: Metadata = {
  title: '内容管理后台 · 南京破晓 DAYBREAK',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
