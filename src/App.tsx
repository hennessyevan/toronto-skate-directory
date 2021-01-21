import { Card, ChevronRightIcon, Heading, Spinner, Text } from 'evergreen-ui'
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useGeolocation } from 'react-use'

interface AppProps {}

const queryClient = new QueryClient()

export function App({}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AllRinks />
    </QueryClientProvider>
  )
}

type RinkListEntry = {
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
  reservations?: any
  website: string
}

type AllRinksData = {
  features: {
    attributes: RinkListEntry
  }[]
}

function AllRinks() {
  const { latitude, longitude, loading: geoLocationLoading } = useGeolocation()
  const { data, isLoading } = useQuery<AllRinksData>('rinks', async () => {
    return await fetch('/api/rinks').then(r => {
      return r.json()
    })
  })

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 1440,
      }}
    >
      <Heading size={800} marginBottom={16}>
        All Rinks
      </Heading>
      {geoLocationLoading ? <Spinner size={16} /> : <Text>{latitude}</Text>}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            placeContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '100vh',
          }}
        >
          <Spinner />
        </div>
      ) : (
        <pre>{JSON.stringify(data, null, 3)}</pre>
        // <Rinks rinks={data?.map(f => f.attributes)} />
      )}
    </div>
  )
}

function Rinks({ rinks }: { rinks: RinkListEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 16,
      }}
    >
      {rinks.map(rink => (
        <Rink key={rink.globalid} rink={rink} />
      ))}
    </div>
  )
}

function Rink({ rink }: { rink: RinkListEntry }) {
  return (
    <Card
      border
      padding={16}
      key={rink.globalid}
      display="flex"
      placeItems="center"
      hoverElevation={2}
    >
      <div>
        <Heading paddingBottom={4}>{rink.location}</Heading>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text>{rink.address}</Text>
          <Text>{rink.operational_hours}</Text>
        </div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <ChevronRightIcon />
      </div>
    </Card>
  )
}
