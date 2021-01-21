import { json, opine } from 'https://deno.land/x/opine@1.1.0/mod.ts'
import { every15Minute, hourly } from 'https://deno.land/x/deno_cron/cron.ts'

const cache = new Map()

enum CacheKeys {
  RINK_INDEX = 'rink-index',
}

const app = opine()
app.use(json())

// MARK - Routes
app.get('/rink-index', async (req, res) => {
  const data = await getAllRinksInfo()
  res.send(data)
})

app.get<{ id: string }>('/rink-info/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    res.setStatus(500).send('You need to provide an id')
    return
  }

  const data = await getRinkInfo(id)

  res.send(data)
})

/**
 * Gets all the rink info we can from arcgis.
 */
async function getAllRinksInfo() {
  let data = cache.get(CacheKeys.RINK_INDEX)

  if (!data) {
    console.log('Not cached - Downloading /rinks')
    data = await fetch(
      'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/Skate_Locations_View2/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100&resultOffset=0&resultRecordCount=2000',
    ).then(r => r.json())
    data = data?.features.map((d: any) => d.attributes)
    cache.set(CacheKeys.RINK_INDEX, data)
  } else {
    console.log('Using cached result /rinks')
  }

  return data
}

async function getRinkInfo(id: string) {
  let data = cache.get(id)

  if (!data) {
    console.log(`Not cached - Downloading /rink/${id}`)
    data = await fetch(
      `https://www.toronto.ca/data/parks/live/reservations/skate/${id}.json`,
    )
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('utf-16le')
        const text = decoder.decode(buffer)
        return JSON.parse(text)
      })
      .catch(() => ({})) //240 always fails

    cache.set(id, data)
  } else {
    console.log(`Using cached /rink/${id}`)
  }

  return data
}

every15Minute(assembleRinkData)
async function assembleRinkData() {
  console.log('Assembling rink data')
  const rinks = await getAllRinksInfo()

  for (const rink of rinks) {
    const id = rink.locationid
    const rinkData = await getRinkInfo(id)
    rink.reservations = rinkData
  }

  cache.set(CacheKeys.RINK_INDEX, rinks)

  console.log('Done rink data assembly')
}

app.listen(process.env.PORT || 4000, () => console.log('running on 4000'))
