import Box from '@parishconnect/box'
import {
  Text,
  Button,
  Card,
  HeartIcon,
  IconButton,
  XIcon,
  Avatar,
  Heading,
  Link,
} from '@parishconnect/react-ui'
import React from 'react'
import { useSessionStorage } from 'react-use'
import { containerPadding } from './App'
import evan from './evan-thumb.jpg'

export function Donate() {
  const [showDonate, setShowDonate] = useSessionStorage('show-donate', true)

  if (!showDonate) return null

  return (
    <Card
      padding={containerPadding}
      maxWidth={500}
      width={`calc(100vw - ${containerPadding} * 2)`}
      marginTop={8}
      display="flex"
      elevation={4}
      background="rgba(0,0,0,0.65)"
      alignItems="center"
      css={{ backdropFilter: 'blur(15px) saturate(180%)' }}
      zIndex={90}
    >
      <IconButton
        icon={XIcon}
        color="white"
        marginRight={4}
        onClick={() => setShowDonate(false)}
        css={{
          '&:hover': {
            background: 'rgba(0,0,0,0.15)',
          },
        }}
      />
      <Box paddingX={4} flexShrink={1}>
        <Box
          is="a"
          href="https://www.hennessyevan.com"
          target="_blank"
          display="flex"
          alignItems="center"
          paddingBottom={8}
          textDecoration="none"
        >
          <Avatar size={36} src={evan} name="Evan" marginRight={6} />
          <Heading size={700} color="white">
            Hi 👋.
          </Heading>
        </Box>
        <Text color="white">
          Has this saved you some time to get you outside on the ice?
        </Text>
      </Box>
      <a
        target="_blank"
        href="https://paypal.me/hennessyevan/5"
        style={{ textDecoration: 'none' }}
      >
        <Button
          whiteSpace="nowrap"
          alignItems="center"
          intent="danger"
          appearance="primary"
          iconBefore={HeartIcon}
        >
          Buy me a coffee
        </Button>
      </a>
    </Card>
  )
}
