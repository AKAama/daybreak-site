import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
export const generateMetadata = ({params,searchParams}:any) => generatePageMetadata({config,params,searchParams})
export default function Page({params,searchParams}:any){return <RootPage config={config} params={params} searchParams={searchParams}/>}
