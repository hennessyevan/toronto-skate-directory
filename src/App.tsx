import {
  Card,
  ChevronRightIcon,
  Heading,
  SegmentedControl,
  Pane,
  Spinner,
  Text,
  Table,
} from 'evergreen-ui'
import { DateTime } from 'luxon'
import { motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useClickAway, useGeolocation } from 'react-use'
import sortByDistance from 'sort-distance'
import Box from 'ui-box'

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
  reservations?: {
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

function AllRinks() {
  const { latitude, longitude, loading: geoLocationLoading } = useGeolocation()
  const { data, isLoading } = useQuery<RinkListEntry[]>('rinks', async () => {
    return await fetch(
      'https://toronto-skate-api.herokuapp.com/rink-index',
    ).then(r => r.json())
  })

  const roundedLatitude = latitude?.toPrecision(5)
  const roundedLongitude = longitude?.toPrecision(5)

  const sortedData = useMemo(() => {
    if (!data) return []
    return sortByDistance({ y: roundedLatitude, x: roundedLongitude }, data)
  }, [data, roundedLatitude, roundedLongitude])

  return (
    <Box
      height="100%"
      maxHeight="100vh"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box
        padding={16}
        paddingBottom={0}
        display="flex"
        alignItems="center"
        gap={8}
      >
        <Heading size={800}>Closest rinks with availability right now</Heading>
        <iframe
          src="https://github.com/sponsors/hennessyevan/button"
          title="Sponsor hennessyevan"
          height="35"
          width="116"
          style={{ border: 0 }}
        />
      </Box>
      {geoLocationLoading ? (
        <Spinner size={16} />
      ) : (
        <Box padding={16} paddingTop={16}>
          <Text>
            Nearest to {roundedLatitude}, {roundedLongitude}
          </Text>
        </Box>
      )}
      {isLoading ? (
        <Box
          display="flex"
          placeContent="center"
          alignContent="center"
          width="100%"
          height="100%"
        >
          <Spinner />
        </Box>
      ) : (
        <Rinks rinks={sortedData} />
      )}
    </Box>
  )
}

function Rinks({ rinks }: { rinks: RinkListEntry[] }) {
  const [open, setOpen] = useState(rinks[0].globalid)
  const openRink = rinks.find(r => r.globalid === open)

  return (
    <Pane display="flex" borderTop width="100%" height="100%">
      <Pane
        display="grid"
        gridAutoFlow="row"
        paddingRight={16}
        gap={16}
        borderRight
        maxHeight="100vh"
        height="100%"
        overflowY="scroll"
        padding={16}
        paddingBottom={24}
      >
        {rinks.map(rink => (
          <Rink
            key={rink.globalid}
            open={open === rink.globalid}
            rink={rink}
            onClick={() => setOpen(rink.globalid)}
            setOpen={setOpen}
          />
        ))}
      </Pane>
      <SingleRink rink={openRink} />
    </Pane>
  )
}

type RinkProps = {
  rink: RinkListEntry
  onClick: () => void
  open: boolean
  setOpen: (arg: string) => void
}

function Rink({ rink, open, onClick, setOpen }: RinkProps) {
  const ref = useRef(null)
  useClickAway(ref, () => {
    setOpen('')
  })

  return (
    <Card
      is={motion.div}
      layout
      border
      padding={16}
      key={rink.globalid}
      display="flex"
      placeItems="center"
      hoverElevation={2}
      background={open ? 'tint2' : 'tint1'}
      onClick={onClick}
      cursor="pointer"
    >
      <Box>
        <Heading paddingBottom={4}>{rink.location}</Heading>
        <Box display="flex" flexDirection="column">
          <Text>{rink.address}</Text>
          <Text>{rink.operational_hours}</Text>
        </Box>
      </Box>
      <Box marginLeft="auto">
        <ChevronRightIcon />
      </Box>
    </Card>
  )
}

function SingleRink({ rink }: { rink?: RinkListEntry }) {
  const [day, setDay] = useState<string>('')

  if (!rink) return null

  let weekday: string

  const filteredReservations = (rink.reservations ?? []).filter(reservation => {
    if (day === '') return true

    const weekday = DateTime.fromISO(reservation.d).weekdayLong.toLowerCase()
    return weekday === day
  })

  return (
    <Box
      padding={16}
      paddingBottom={32}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading paddingBottom={16} size={700}>
        {rink?.location}
      </Heading>
      <SegmentedControl
        width="100vw"
        maxWidth={500}
        value={day}
        onChange={v => setDay(v as string)}
        options={[
          { label: 'All', value: '' },
          { label: 'Sun', value: 'sunday' },
          { label: 'Mon', value: 'monday' },
          { label: 'Tues', value: 'tuesday' },
          { label: 'Wed', value: 'wednesday' },
          { label: 'Thu', value: 'thursday' },
          { label: 'Fri', value: 'friday' },
          { label: 'Sat', value: 'saturday' },
        ]}
      />

      <Box paddingY={24} height="100%" overflowY="scroll">
        {filteredReservations.length <= 0 ? (
          <Heading paddingBottom={16}>No Available Slots</Heading>
        ) : (
          <>
            <Heading paddingBottom={16}>
              {filteredReservations.length} Available Slots
            </Heading>
            <Box display="grid" gridAutoFlow="row" gap={8}>
              {filteredReservations?.map(reservation => {
                const date = DateTime.fromISO(reservation.d)
                let showWeekday = false

                if (weekday !== date.weekdayLong) {
                  showWeekday = true
                  weekday = date.weekdayLong
                }

                return (
                  <>
                    {showWeekday && (
                      <Heading paddingTop={16} size={200}>
                        {date.weekdayLong}
                      </Heading>
                    )}
                    <Card
                      is={motion.a}
                      href={`https://efun.toronto.ca/torontofun/Activities/ActivitiesCourseDetails.asp?aid=${reservation.aid}&cid=${reservation.cid}`}
                      target="_blank"
                      layout
                      border
                      padding={16}
                      key={reservation.cid}
                      display="flex"
                      flexDirection="column"
                      hoverElevation={1}
                      cursor="pointer"
                      textDecoration="none"
                    >
                      <Heading size={100}>{reservation.f}</Heading>
                      <Box display="flex">
                        <Heading>
                          {date.toLocaleString({
                            weekday: 'long',
                            month: 'short',
                            day: '2-digit',
                          })}
                        </Heading>
                        <Text marginLeft="auto">{reservation.t}</Text>
                      </Box>
                    </Card>
                  </>
                )
              })}
            </Box>
            <Text marginTop={16}>
              Last Updated {DateTime.fromISO(rink?.updated_at).toRelative()}
            </Text>
          </>
        )}
      </Box>
    </Box>
  )
}
