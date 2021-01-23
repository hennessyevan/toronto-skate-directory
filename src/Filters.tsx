import Box from '@parishconnect/box'
import {
  AlertCircleIcon,
  Button,
  Card,
  CornerDialog,
  Dialog,
  FilterIcon,
  Heading,
  IconButton,
  InfoIcon,
  majorScale,
  Pill,
  Portal,
  XIcon,
} from '@parishconnect/react-ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { DateTime, Info, Interval } from 'luxon'
import React, { useState, useEffect, useRef } from 'react'
import { useMedia, useTimeoutFn, useWindowSize } from 'react-use'
import { maxWidth } from './AllAvailableTimes'
import { containerPadding } from './App'
import { Donate } from './Donate'

type FiltersProps = {
  days: string[]
  setDays: (days: string[]) => void
  // hourInteraval: Interval
  // setHourInterval: (interval: Interval) => void
}
export function Filters({ days, setDays }: FiltersProps) {
  // const [open, setOpen] = useState(true)
  const [dirty, setDirty] = useState(true)
  // const isDesktop = useMedia('(min-width: 1024px)')
  const { width } = useWindowSize()

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={containerPadding}
        right={`max(${width - maxWidth * 2 - 16}px, ${containerPadding})`}
        zIndex={1000}
        justifyContent="end"
      >
        <Box position="relative">
          <Box display="grid" gridAutoFlow="row" gap={8}>
            <Card
              key="filterCard"
              is={motion.div}
              border="muted"
              padding={16}
              background="rgba(255,255,255,0.35)"
              css={{ backdropFilter: 'blur(15px) saturate(180%)' }}
              maxWidth="min(calc(100vw - 16px), 400px)"
              layoutId="container"
              zIndex={100}
              borderRadius={16}
              elevation={4}
              bottom={0}
              right={0}
              position="absolute"
            >
              <Box display="flex" alignItems="center">
                <Heading is={motion.h1} layoutId="title">
                  Filter
                </Heading>
              </Box>
              <Box paddingY={16}>
                <Heading paddingBottom={8} size={400} color="theme">
                  Weekday
                </Heading>
                <WeekdayFilter days={days} setDays={setDays} />
              </Box>
            </Card>
          </Box>
        </Box>
        <Donate key="donate" />
      </Box>
    </Portal>
  )
}

export const weekdays = Info.weekdays('short').map(w =>
  w.substring(0, 2).toUpperCase(),
)

function WeekdayFilter({
  days,
  setDays,
}: {
  days: string[]
  setDays: (value: string[]) => void
}) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${weekdays.length}, 1fr)`}
      gap={8}
    >
      {weekdays.map(weekday => (
        <Button
          key={weekday}
          appearance={days.includes(weekday) ? 'primary' : 'default'}
          onClick={() => {
            if (days.includes(weekday)) {
              setDays(days.filter(w => w !== weekday))
            } else {
              setDays([weekday].concat(days))
            }
          }}
          display="flex"
          justifyContent="center"
          round
          height={majorScale(4)}
          width={majorScale(4)}
          padding={0}
        >
          {weekday}
        </Button>
      ))}
    </Box>
  )
}
