import Box from '@parishconnect/box'
import { Heading, Spinner, Text } from '@parishconnect/react-ui'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useGeolocation } from 'react-use'
import sortByDistance from 'sort-distance'
import type { RinkListEntry } from './types'

export function AllRinks() {
  const roundedLatitude = latitude?.toPrecision(5)
  const roundedLongitude = longitude?.toPrecision(5)

  const sortedData = useMemo(() => {
    if (!data) return []
    return sortByDistance({ y: roundedLatitude, x: roundedLongitude }, data)
  }, [data, roundedLatitude, roundedLongitude])

  return (
    <Box display="flex" flexDirection="column">
      <Heading size={800}>Closest rinks with availability right now</Heading>

      <Box paddingTop={8}>
        <Text>
          Nearest to{' '}
          {geoLocationLoading ? (
            <Spinner size={16} />
          ) : (
            <>
              {roundedLatitude}, {roundedLongitude}
            </>
          )}
        </Text>
      </Box>
      {
        isLoading ? (
          <Box
            display="flex"
            placeContent="center"
            alignContent="center"
            width="100%"
            height="100%"
          >
            <Spinner />
          </Box>
        ) : null
        // <Rinks rinks={sortedData} />
      }
    </Box>
  )
}
