var config = {
  name: 'Las Vegas',
  address: '495 S. Las Vegas Blvd',
  searchLocation: 'Las Vegas, NV',
  mapAttribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
  mapTileLayerURL: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
//  mapAttribution: "©2012 Nokia <a href=\"http://here.net/services/terms\">Terms of Use</a>",
//  mapTileLayerURL: "https://maps.nlp.nokia.com/maptiler/v2/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=61YWYROufLu_f8ylE0vn0Q&app_id=qIWDkliFCtLntLma2e6O",
  latitude: 36.18,
  longitude: -115.18,
  initialZoom: 13,
  finalZoom: 14,
  fileName: '/data/region.geojson',
  tagline: 'Because the city boundaries are a lot weirder than you think.',
  about: 'Las Vegas is one of the most visited cities in the world, and yet its most famous destination&mdash;a 6.8km boulevard of enormous themed casinos commonly known as "The Strip"&mdash;is not actually located inside Las Vegas but rather south of the city limits.  To add to the confusion, the city\'s true borders are often jagged and full of small holes.  It is a common misconception even amongst residents (who may still hold a valid Las Vegas address, according to the U.S. Postal Service!) that they are under the jurisdiction of Las Vegas when in fact they live in surrounding communities of unincorporated Clark County.  Many services provided by the City of Las Vegas require that a resident actually be within city limits; this site provides an easy way to check.',
  responseYes: 'You are within city limits!',
  responseNo: 'You are not in Las Vegas!'
}

module.exports = config;
