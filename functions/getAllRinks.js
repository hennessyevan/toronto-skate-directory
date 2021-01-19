const fetch = require('node-fetch')

exports.handler = async () => {
  let data = {}

  data = await fetch(
    'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/Skate_Locations_View2/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100&resultOffset=0&resultRecordCount=2000',
  ).then(r => r.json())

  return {
    statusCode: 200,
    headers: { 'Cache-Control': 'public, s-maxage=1800' },
    body: JSON.stringify(data),
  }
}
