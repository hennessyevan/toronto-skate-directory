import { Card, Heading, Text, ChevronRightIcon, Spinner } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useQuery, QueryClientProvider, QueryClient } from 'react-query'

interface AppProps {}

const queryClient = new QueryClient()

export function App({}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GetAllRinks />
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

function GetAllRinks() {
  const { data, isLoading } = useQuery<AllRinksData>('rinks', async () => {
    return await fetch('/api/getAllRinks').then(r => {
      return r.json()
    })
  })

  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <h1>Rinks</h1>
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
        <Rinks rinks={data!.features.map(f => f.attributes)} />
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
        <Card
          border
          padding={16}
          key={rink.globalid}
          display="flex"
          placeItems="center"
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
      ))}
    </div>
  )
}

function Rink({ id }: { id: string }) {
  const [rinkData, setRinkData] = useState()

  useEffect(() => {
    ;(async function loadRinkData() {
      const data = await fetch(`/api/getRinkInfo?id=${id}`).then(r => {
        return r.json()
      })

      setRinkData(data)
    })()
  }, [])

  return (
    <div>
      First Rink
      <pre>{JSON.stringify(rinkData, null, 3)}</pre>
    </div>
  )
}
