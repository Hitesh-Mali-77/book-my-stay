console.log("MapTiler key:", key);

const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
  center: listingData.coordinates, // [lng, lat]
  zoom: 10
});

map.addControl(new maplibregl.NavigationControl());

console.log(listingData.coordinates);

new maplibregl.Marker()
  .setLngLat(listingData.coordinates)
  .setPopup(
    new maplibregl.Popup().setHTML(`<b>${listingData.title}</b><br>${listingData.location}`)
  )
  .addTo(map)
  // .togglePopup(); // optional — opens popup automatically
