import './Loading.css'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { Control } from 'leaflet';

interface LoadingProps {
    isLoading: boolean | null;
}

const Loading = ({ isLoading }: LoadingProps) => {
    const map = useMap();

    useEffect(() => {
        if (!isLoading) {
            return;
        }
        const loading: Control = new L.Control({ position: 'topright' });

        loading.onAdd = () => {
            const div = L.DomUtil.create('div', 'info loading lds-roller');
            let label = [];
            label.push('<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>');
            return div;
        };


        loading.addTo(map);

        return () => {
            loading.remove();
        };
    }, [map, isLoading]);

    return null;
}

export default Loading;
