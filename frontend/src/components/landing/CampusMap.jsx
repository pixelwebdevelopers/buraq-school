import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaExternalLinkAlt } from 'react-icons/fa';
import useScrollReveal from '@/hooks/useScrollReveal';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CAMPUSES = [
    {
        id: 1,
        name: 'Main Campus',
        position: [33.5647, 73.1044],
        address: 'Car Choke, Scheme-3, Chaklala, Rawalpindi',
        phone: '0312-5169321',
        type: 'School & College'
    },
    {
        id: 2,
        name: 'E-Rehmatabad Campus',
        position: [33.5855, 73.0906],
        address: 'E-Block Rehmatabad, Chaklala, Rawalpindi',
        phone: '0334-5817084',
        type: 'School Section'
    },
    {
        id: 3,
        name: 'A-Rehmatabad Campus',
        position: [33.5822, 73.0955],
        address: 'Opp. Girls High School, Rehmatabad, Chaklala, Rwp.',
        phone: '0311-5373723',
        type: 'School Section'
    },
    {
        id: 4,
        name: 'Palm City Campus',
        position: [33.5700, 73.1100],
        address: 'Jaba Palm City, Chaklala, Rawalpindi',
        phone: '0347-5749160',
        type: 'School Section'
    },
];

export default function CampusMap() {
    const sectionRef = useScrollReveal();
    // Centering slightly further north to get more spacing at top for E-Rehmatabad
    const mapCenter = [33.580, 73.100];

    return (
        <section id="location" className="relative w-full bg-white overflow-hidden">
            <div ref={sectionRef} className="reveal">
                {/* Full Width Map Container - Transition directly from Carousel */}
                <div className="relative h-[450px] w-full border-b border-border shadow-inner grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                    <MapContainer
                        center={mapCenter}
                        zoom={14}
                        scrollWheelZoom={false}
                        className="h-full w-full z-10"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {CAMPUSES.map((campus) => (
                            <Marker key={campus.id} position={campus.position}>
                                <Tooltip
                                    permanent
                                    direction={campus.id === 3 ? "right" : "top"}
                                    offset={campus.id === 3 ? [20, 0] : [0, -40]}
                                    className="marker-label"
                                >
                                    <span className="font-display font-bold text-primary text-[10px] uppercase tracking-wider">
                                        {campus.name}
                                    </span>
                                </Tooltip>
                                <Popup className="campus-popup">
                                    <div className="p-1 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
                                                {campus.type}
                                            </span>
                                        </div>
                                        <h3 className="font-display font-bold text-primary text-base mb-1">
                                            {campus.name}
                                        </h3>
                                        <div className="flex items-start gap-2 text-xs text-text-secondary mb-3">
                                            <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-secondary" />
                                            <span>{campus.address}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                            <a
                                                href={`tel:${campus.phone}`}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-secondary transition-colors"
                                            >
                                                <FaPhoneAlt /> {campus.phone}
                                            </a>
                                            <button className="text-gray-300 hover:text-primary transition-colors">
                                                <FaExternalLinkAlt className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </section>
    );
}
