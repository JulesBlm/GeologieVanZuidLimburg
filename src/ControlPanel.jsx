import React, {useState, useLayoutEffect} from 'react';
import timescale from './timescale';

import plaatsen from './JSONs/plaatsen.json';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default function ControlPanel({viewState, setViewState}) {
    const [index, setIndex] = useState(0)
    const {name, period, description} = plaatsen[index];
    const Container = defaultContainer; //this.props.containerComponent || 

    useLayoutEffect(() => {
        const dimensions = {
            width: (window.innerWidth > 600) ? (0.3 * window.innerWidth - 4) : (window.innerWidth - 4),
            height: 150
        };
        timescale.init("timescale", dimensions);
    }, [])

    const handleClick = (increment) => {
        setIndex(index + increment);
        const { period, latitude, longitude, zoom } = plaatsen[index+increment]; // Ugly hack because index state is not updated immediately, but using timescale in useEffect won't work becaus timiscale is not initialized yet so root node is still unknown
        setViewState({
            ...viewState,
            latitude,
            longitude,
            zoom,
            transitionDuration: 1000
        })
        timescale.goToName(period); 
    }

    return (
        <Container>
            <div className="text">
                <h2>{name}</h2>
                <h3>{period}</h3>
                <p dangerouslySetInnerHTML={ {__html:description} } />
            </div>
            <div id="button-bar">
                <button
                    onClick={() => (index > 0) && handleClick(-1) }
                    className="control-button"
                    disabled={index === 0}>
                    Vorige
                </button>
                <button 
                    onClick={() => (index < plaatsen.length - 1) && handleClick(1)} 
                    className="control-button"
                    disabled={index === plaatsen.length - 1}>
                    Volgende
                </button>
            </div>
            <div id="timescale"></div>
        </Container>
    )
}
