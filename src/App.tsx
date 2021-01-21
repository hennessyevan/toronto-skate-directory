import { Card, ChevronRightIcon, Heading, Spinner, Text } from 'evergreen-ui'
import { useCallback, useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useGeolocation } from 'react-use'
import sortByDistance from 'sort-distance'

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

function AllRinks() {
  const { latitude, longitude, loading: geoLocationLoading } = useGeolocation()
  const { data, isLoading } = useQuery<RinkListEntry[]>('rinks', async () => {
    return await fetch(
      'https://toronto-skate-api.herokuapp.com/rink-index',
    ).then(r => r.json())
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    return sortByDistance({ y: latitude, x: longitude }, data)
  }, [data, latitude, longitude])

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 1440,
      }}
    >
      <Heading size={800} paddingBottom={8}>
        Closest rinks with availability right now
      </Heading>
      {geoLocationLoading ? (
        <Spinner size={16} />
      ) : (
        <div style={{ paddingBottom: 16 }}>
          <Text>
            Nearest to {latitude}, {longitude}
          </Text>
        </div>
      )}
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
        // <pre>{JSON.stringify(sortedData, null, 3)}</pre>
        <Rinks rinks={sortedData} />
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
