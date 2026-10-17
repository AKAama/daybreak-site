'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClientArgs } from 'payload'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

/** 后台客户端组件通过它调用 Payload 注册的服务端函数（列表状态、slug 生成等） */
export async function serverFunction(args: ServerFunctionClientArgs) {
  return handleServerFunctions({ ...args, config, importMap })
}
