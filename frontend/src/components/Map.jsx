import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// SWR still works fine in Vite
import useSWR from "swr";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Map() {
  const { data } = useSWR(`${API}/api/reports?limit=50`, fetcher);
  const reports = data?.reports || [];

  const [center, setCenter] = useState([21.146633, 79.08886]); // fallback center

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) =>
        setCenter([p.coords.latitude, p.coords.longitude])
      );
    }
  }, []);

  // Fix Leaflet marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="w-full h-[70vh]">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {reports.map((r) => (
          <Marker
            key={r._id}
            position={[r.location.coordinates[1], r.location.coordinates[0]]}
          >
            <Popup>
              <div>
                <strong>{r.title || r.category}</strong>
              </div>
              <div>{r.description}</div>
              <div>Priority: {r.priority}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
