import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useGeolocation } from 'react-use'
import { AllAvailableTimes } from './AllAvailableTimes'
import type { ChildProps, RinkListEntry } from './types'

const queryClient = new QueryClient()

export const containerPadding = 'clamp(8px, 1.5vw, 16px)'

interface AppProps {}
export function App({}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  )
}

function Routes() {
  const geolocation = useGeolocation({
    maximumAge: Infinity,
  })
  const rinkData = useQuery<RinkListEntry[]>('rinks', async () => {
    return await fetch(
      '//toronto-skating.hennessyevan.com/rink-index',
    ).then(r => r.json())
  })

  const childProps: ChildProps = {
    geolocation,
    ...rinkData,
  }

  return <AllAvailableTimes {...childProps} />
}
