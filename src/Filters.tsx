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
  setDays: (days: string[]) => void
  // hourInteraval: Interval
  // setHourInterval: (interval: Interval) => void
}
export function Filters({ setDays }: FiltersProps) {
  const [open, setOpen] = useState(false)
  const [dirty, setDirty] = useState(true)
  const isDesktop = useMedia('(min-width: 1024px)')
  const { width } = useWindowSize()
  useTimeoutFn(() => {
    setOpen(isDesktop)
  }, 5000)

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={containerPadding}
        right={`max(${width - maxWidth * 2 - 16}px, ${containerPadding})`}
        zIndex={100}
        justifyContent="end"
      >
        <Box position="relative">
          <AnimateSharedLayout type="crossfade">
            <Button
              iconBefore={dirty ? <Pill marginRight={6}>1</Pill> : FilterIcon}
              is={motion.button}
              height={45}
              marginLeft="auto"
              onClick={() => setOpen(true)}
              appearance="primary"
              zIndex={100}
              layoutId="container"
              bottom={0}
              right={0}
              position="absolute"
            >
              <motion.span layoutId="title">Filter</motion.span>
            </Button>
            <Box display="grid" gridAutoFlow="row" gap={8}>
              <AnimatePresence>
                {open && (
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
                      <IconButton
                        marginLeft="auto"
                        icon={XIcon}
                        onClick={() => setOpen(false)}
                        appearance="minimal"
                      />
                    </Box>
                    <Box paddingY={16}>
                      <Heading paddingBottom={8} size={400} color="theme">
                        Weekday
                      </Heading>
                      <WeekdayFilter
                        onChange={selectedWeekdays => {
                          setDirty(selectedWeekdays.length < 7)
                          setDays(selectedWeekdays)
                        }}
                      />
                    </Box>
                  </Card>
                )}
              </AnimatePresence>
            </Box>
          </AnimateSharedLayout>
        </Box>
        <Donate key="donate" />
      </Box>
    </Portal>
  )
}

export const weekdays = Info.weekdays('short').map(w =>
  w.substring(0, 2).toUpperCase(),
)

const nextWeekdays = [
  DateTime.local().weekdayShort,
  DateTime.local().plus({ day: 1 }).weekdayShort,
  DateTime.local().plus({ day: 2 }).weekdayShort,
].map(d => d.substring(0, 2).toUpperCase())

function WeekdayFilter({ onChange }: { onChange: (value: string[]) => void }) {
  const [selectedWeekdays, setSelectedWeekdays] = useState(nextWeekdays)

  useEffect(() => {
    onChange(selectedWeekdays)
  }, [selectedWeekdays])

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${weekdays.length}, 1fr)`}
      gap={8}
    >
      {weekdays.map(weekday => (
        <Button
          key={weekday}
          appearance={
            selectedWeekdays.includes(weekday) ? 'primary' : 'default'
          }
          onClick={() => {
            if (selectedWeekdays.includes(weekday)) {
              setSelectedWeekdays(selectedWeekdays.filter(w => w !== weekday))
            } else {
              setSelectedWeekdays([weekday].concat(selectedWeekdays))
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
