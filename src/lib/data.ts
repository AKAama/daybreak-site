import { getPayload } from 'payload'
import config from '@payload-config'
export async function cms(){return getPayload({config})}
export function mediaUrl(v:any):string {if(!v || typeof v!=='object')return ''; return v.sizes?.hero?.url || v.url || ''}
export async function homepageData(){try{const p=await cms();const [home,players,albums]=await Promise.all([p.findGlobal({slug:'homepage',depth:2}),p.find({collection:'players',sort:'sortOrder',limit:100,depth:2}),p.find({collection:'albums',where:{published:{equals:true}},sort:'-date',limit:30,depth:2})]);return {home,players:players.docs,albums:albums.docs}}catch{return {home:null,players:[],albums:[]}}}
