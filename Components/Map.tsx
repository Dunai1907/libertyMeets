import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { DEFAULT_LAT, DEFAULT_LNG } from "../constants/constants";
import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const center = {
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
};

type MapProps = {
  appUrl: string;
  userLat: number | undefined;
  userLng: number | undefined;
  lat: number;
  lng: number;
};

function LocationMarker(props: MapProps) {
  const { appUrl, userLat, userLng, lat, lng } = props;
  const [position, setPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  });
  const markerRef = useRef<any>(null);

  const map = useMapEvents({
    load() {
      map.locate();
    },
    locationfound(e: any) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    (async () => {
      if (lat && lng) {
        const position = {
          lat,
          lng,
        };
        setPosition(position);
        map.flyTo(position, map.getZoom());
        if (!userLat || !userLng) {
          return;
        }
        if (
          userLat?.toFixed(2) !== lat.toFixed(2) ||
          userLng?.toFixed(2) !== lng.toFixed(2)
        ) {
          await axios.post(
            `${appUrl}/api/users/update`,
            { location: [lat, lng] },
            {
              withCredentials: true,
            }
          );
        }
      }
    })();
  }, [appUrl, lat, lng, map, userLat, userLng]);

  const icon = L.icon({
    iconUrl: "/decor/marker.png",
    iconAnchor: [64 / 2, 64],
  });

  return position === null ? null : (
    <Marker position={position} ref={markerRef} icon={icon} />
  );
}

export default function Map(props: MapProps) {
  const { appUrl, userLat, userLng, lat, lng } = props;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: 460, width: 842 }}
      className={styles.mapContainer}
    >
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        appUrl={appUrl}
        userLat={userLat}
        userLng={userLng}
        lat={lat}
        lng={lng}
      />
    </MapContainer>
  );
}
