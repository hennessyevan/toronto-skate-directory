import Box from '@parishconnect/box'
import {
  Card,
  ChevronDownIcon,
  ChevronRightIcon,
  Heading,
  IconButton,
  Link,
  Pane,
  Spinner,
  Text,
} from '@parishconnect/react-ui'
import { sortBy } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useMemo, useState } from 'react'
import sortByDistance from 'sort-distance'
import { containerPadding } from './App'
import { Donate } from './Donate'
import { Filters } from './Filters'
import type { ChildProps, RinkListEntry } from './types'

export const maxWidth = 700

export function AllAvailableTimes({
  data: rinks = [],
  geolocation,
}: ChildProps) {
  const [days, setDays] = useState<string[]>([])

  const rinksWithAvailableTimes = rinks.filter(rink => {
    const availableReservations = rink.reservations.filter(
      reservation => reservation.s > 0,
    )
    if (availableReservations.length > 0) {
      return true
    }
  })

  const roundedLatitude = geolocation.latitude?.toPrecision(5)
  const roundedLongitude = geolocation.longitude?.toPrecision(5)

  const sortedRinks: RinkListEntry[] = useMemo(() => {
    if (!rinksWithAvailableTimes) return []

    let rinks: RinkListEntry[]

    if (!geolocation.error) {
      rinks = sortByDistance(
        { y: roundedLatitude, x: roundedLongitude },
        rinksWithAvailableTimes,
      )
    } else {
      rinks = sortBy(rinksWithAvailableTimes, 'location')
    }

    return rinks
  }, [rinksWithAvailableTimes, roundedLatitude, roundedLongitude])

  const filteredRinks: RinkListEntry[] = useMemo(() => {
    let rinks = sortedRinks
    if (days.length !== 7) {
      rinks = rinks.map(rink => {
        return {
          ...rink,
          reservations: rink.reservations.filter(reservation => {
            const weekday = DateTime.fromISO(reservation.d)
              .weekdayShort.substring(0, 2)
              .toUpperCase()
            return days.includes(weekday)
          }),
        }
      })
    }

    return rinks
  }, [sortedRinks, days])

  return (
    <Pane width="100%">
      <Pane
        background="rgba(255,255,255,0.65)"
        css={{ backdropFilter: 'blur(15px) saturate(180%)' }}
        borderBottom
        padding={16}
        width="100%"
        height={80}
        position="sticky"
        top={0}
        zIndex={12}
      >
        <Box
          marginX="auto"
          display="flex"
          alignItems="center"
          maxWidth={`calc(${maxWidth}px - ${containerPadding} * 2)`}
        >
          <Box>
            <Heading size={700}>All available time slots</Heading>
            <Heading color="theme" size={400}>
              {geolocation.error
                ? 'Sorted Alphabetically'
                : geolocation.loading
                ? 'Loading nearest rinks'
                : `Sorted by rinks nearest to ${geolocation.latitude}, ${geolocation.longitude}`}
            </Heading>
          </Box>
        </Box>
      </Pane>

      <Filters setDays={setDays} />

      <Box width="100%" maxWidth={maxWidth} marginX="auto">
        {!geolocation.error && geolocation.loading ? (
          <Box
            width="100%"
            height="calc(100vh - 200px)"
            display="flex"
            placeContent="center"
            alignItems="center"
          >
            <Spinner />
          </Box>
        ) : (
          filteredRinks.map((rink, index) => (
            <RinkEntry
              key={rink.globalid}
              rink={rink}
              initiallyHidden={index > 5}
            />
          ))
        )}
      </Box>
    </Pane>
  )
}

function RinkEntry({
  rink,
  initiallyHidden,
}: {
  rink: RinkListEntry
  initiallyHidden: boolean
}) {
  const [hidden, setHidden] = useState(initiallyHidden)

  let currWeekday = ''

  return (
    <Box>
      <Pane
        position="sticky"
        background="rgba(255,255,255,0.65)"
        cursor="pointer"
        css={{
          backdropFilter: 'blur(15px) saturate(180%)',
          transition: '300ms',
          '&:hover': {
            background: 'rgba(225,225,225,0.65)',
          },
        }}
        top={80}
        zIndex={10}
        marginTop={24}
        marginBottom={4}
        marginX="auto"
        padding={containerPadding}
        paddingY={16}
        display="flex"
        alignItems="center"
        borderBottom="muted"
        onClick={() => setHidden(!hidden)}
      >
        <Box>
          <Heading size={500}>{rink.location}</Heading>
          <Heading
            size={300}
            color="theme"
          >{` ${rink.reservations.length} time slots available`}</Heading>
        </Box>
        <IconButton
          appearance="minimal"
          marginLeft="auto"
          icon={hidden ? ChevronRightIcon : ChevronDownIcon}
        />
      </Pane>

      {!hidden && (
        <Box
          padding={containerPadding}
          key={rink.globalid}
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(325px, 1fr))"
          alignItems="end"
          gap={8}
        >
          {rink.reservations.map(reservation => {
            const weekday = DateTime.fromISO(reservation.d).weekdayLong
            let showWeekday = false

            if (weekday + rink.locationid !== currWeekday) {
              showWeekday = true
              currWeekday = weekday + rink.locationid
            }

            return (
              <Box key={reservation.cid}>
                {showWeekday && (
                  <Heading marginY={16} size={100}>
                    {weekday}
                  </Heading>
                )}
                <TimeSlot key={reservation.cid} {...reservation} rink={rink} />
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

function TimeSlot({
  aid: activityId,
  cid: courseId,
  t: times,
  d,
  f: facility,
  rink,
}: RinkListEntry['reservations'][0] & { rink: RinkListEntry }) {
  const date = DateTime.fromISO(d)

  return (
    <Card
      is="a"
      href={`https://efun.toronto.ca/torontofun/Activities/ActivitiesCourseDetails.asp?aid=${activityId}&cid=${courseId}`}
      target="_blank"
      rel="noopener"
      border
      padding={12}
      paddingX={16}
      color="#2d2d2d"
      display="flex"
      flexDirection="column"
      cursor="pointer"
      textDecoration="none"
    >
      <Heading size={100}>{rink.location}</Heading>
      <Box display="flex">
        <Heading color="theme">
          {date.toLocaleString({
            weekday: 'long',
            month: 'short',
            day: '2-digit',
          })}
        </Heading>
        <Text marginLeft="auto">{times}</Text>
      </Box>
    </Card>
  )
}
