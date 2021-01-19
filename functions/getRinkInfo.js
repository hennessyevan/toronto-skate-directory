const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  let data = ''
  const id = event.queryStringParameters['id']

  if (!id) {
    return {
      statusCode: 422,
      body: 'You must provide an id',
    }
  }

  data = await fetch(
    `https://www.toronto.ca/data/parks/live/reservations/skate/${id}.json`,
  ).then(r => r.text())

  data = data.slice(2)
  data = data
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f')
  // remove non-printable and other non-valid JSON chars
  data = data.replace(/[\u0000-\u0019]+/g, '')
  console.log(data)
  data = JSON.parse(data)

  return {
    statusCode: 200,
    headers: { 'Cache-Control': 'public, s-maxage=1800' },
    body: JSON.stringify(data),
  }
}
