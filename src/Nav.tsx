import Box from '@parishconnect/box'
import {
  Button,
  Card,
  ClockIcon,
  Heading,
  HeartIcon,
  Pane,
  Text,
  MenuIcon,
  defaultTheme,
} from '@parishconnect/react-ui'
import { NavLink } from 'react-router-dom'
import type { ChildProps } from './types'

type NavItemProps = {
  text: string
  url: string
  icon: any
}
const navItems: NavItemProps[] = [
  {
    text: 'Available Times',
    url: '/available',
    icon: ClockIcon,
  },
  {
    text: 'Rinks',
    url: '/rinks',
    icon: MenuIcon,
  },
]

export function Nav({ geolocation }: ChildProps) {
  return (
    <Pane
      position="sticky"
      top={0}
      height="100vh"
      width="100%"
      maxWidth={300}
      minWidth={225}
      background="tint1"
      padding={16}
      display="flex"
      flexDirection="column"
    >
      <Heading paddingTop={16} size={700}>
        Skating Directory
      </Heading>
      {/* <SearchInput paddingTop={16} placeholder="Search..." width="100%" /> */}
      <Box display="flex" flexDirection="column" paddingTop={32} height="100%">
        {navItems.map(props => (
          <NavItem active={false} {...props} />
        ))}
      </Box>
    </Pane>
  )
}

function NavItem({
  text,
  url,
  icon: Icon,
}: NavItemProps & { active: boolean }) {
  return (
    <Card
      is={NavLink}
      to={url}
      activeStyle={{
        background: 'rgba(0,0,0,0.05)',
      }}
      paddingX={16}
      paddingY={10}
      marginY={8}
      textDecoration="none"
      css={{
        '&:hover': {
          background: 'rgba(0,0,0,0.035)',
        },
      }}
      display="flex"
      alignItems="center"
    >
      <Icon marginRight={8} color={defaultTheme.colors.intent.none} />
      <Text size={500} color="theme">
        {text}
      </Text>
    </Card>
  )
}
