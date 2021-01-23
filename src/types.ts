import type { UseQueryResult } from 'react-query'
import type { useGeolocation } from 'react-use'

export type RinkListEntry = {
  objectid: number
  facility_master_id: number
  location: string
  locationid: number
  x: number
  y: number
  address: string
  amenities: string
  operational_hours: string
  funguide_url?: string
  globalid: string
  reservations: {
    f: string
    d: string
    t: string
    s: number
    cid: number
    aid: number
  }[]
  website: string
  updated_at?: string
}

export type ChildProps = {
  geolocation: ReturnType<typeof useGeolocation>
} & UseQueryResult<RinkListEntry[]>
