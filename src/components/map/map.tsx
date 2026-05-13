import {useRef, useEffect} from 'react';
import {Icon, Marker, layerGroup} from 'leaflet';
import useMap from '../../hooks/use-map';
import 'leaflet/dist/leaflet.css';
import { Point } from '../../types/point';
import { City } from '../../types/city';
import './map.css';

type MapProps = {
  city: City;
  points: Point[];
  selectedPointId: string | undefined;
  onMarkerHover?: (pointId: string | undefined) => void;
};

const defaultCustomIcon = new Icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

const currentCustomIcon = new Icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

function Map(props: MapProps) {
  const {city, points, selectedPointId, onMarkerHover} = props;
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.latitude,
          lng: point.longitude
        });

        marker
          .setIcon(
            selectedPointId !== undefined && point.id === selectedPointId
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);

        if (onMarkerHover) {
          marker.on('mouseover', () => {
            onMarkerHover(point.id);
          });
          marker.on('mouseout', () => {
            onMarkerHover(undefined);
          });
        }
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPointId, onMarkerHover]);

  return (
    <div className="map">
      <section style={{width: '100%', height: '100%'}} ref={mapRef} data-testid='map'></section>
    </div>
  );
}

export default Map;
