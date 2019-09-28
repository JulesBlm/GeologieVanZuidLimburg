/*
Fix fly to
1. Add correct lat lon's
2. Add more text
3. Bundle mapbox CSS
4. Add meta description

Potential
0. Images and (temperature) charts
1. Async descriptions
2. Performance improvements
3. Bring water to front
*/
import React, { useState, useCallback, useRef } from 'react';
import { render } from 'react-dom';
import ReactMapGL, {NavigationControl} from 'react-map-gl'; // NavigationControl
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from  '@deck.gl/layers';
import { MapboxLayer } from "@deck.gl/mapbox";
import { MapController } from '@deck.gl/core';

import ControlPanel from './ControlPanel';

import geologicalmap from './JSONs/geologielimburg.geojson';
import key from './JSONs/key.json'

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

export default function App() {
  const deckRef = useRef(null);
  const mapRef = useRef(null);
  const [glState, setGlState] = useState({});
  const [hoverState, setHoverState] = useState({});
  const [viewState, setViewState] = useState(
    {
      longitude: 5.850884,
      latitude: 50.864828,
      zoom: 10,
      pitch: 15,
      bearing: 0,
      minZoom: 10,
      maxZoom: 16,
    }
  );

  const onHover = ({x, y, object}) => {
    setHoverState({x, y, hoveredObject: object});
  }


  const onViewStateChange = ({viewState}) => {
    setViewState({...viewState});
  }

  const onWebGLInitialized = (gl) => {
    setGlState({gl});
  }

  const onMapLoad = () => {   // Add deck layer to mapbox
    const map = mapRef.current.getMap();
    const deck = deckRef.current;
    const mapBoxLayer = new MapboxLayer({id: 'geologicalmap', type: GeoJsonLayer}, deck);

    map.addLayer(mapBoxLayer, 'waterway-label');
  }

  const renderTooltip = () => {
    const {x, y, hoveredObject} = hoverState;
    return (
      hoveredObject && (
        <div className="tooltip" style={{top: y, left: x, zIndex: 100}}>
          <div>
            <b>Formatie</b>
          </div>
          <div>
            <div dangerouslySetInnerHTML={ {__html: key[hoveredObject.properties.KRTCODE].info} } />
          </div>
        </div>
      )
    );
  }

  useCallback(() => {
    const resize = ({width, height}) => {
      setViewState({
        ...viewState,
        width: width || window.innerWidth,
        height: height || window.innerHeight
      });
    }

    window.addEventListener('resize', resize);
    // resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [viewState])

  const renderLayers = () => {
    return [
        new GeoJsonLayer({
          id: 'geologicalmap',
          data: geologicalmap,
          opacity: 0.4,
          stroked: true,
          filled: true,
          getFillColor: ({properties}) => key[properties.KRTCODE].color,
          getLineColor: [255, 255, 255, 59],
          pickable: true,
          onHover: onHover
        })
      ];
  }  

  return (
    <>
    <DeckGL
      width={"70%"}
      ref={deckRef}
      layers={renderLayers()}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={{type: MapController, dragRotate: false}}
      onWebGLInitialized={onWebGLInitialized}
      // controller={true}
    >
      {glState && (
      <ReactMapGL
        ref={mapRef}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        reuseMaps
        mapStyle={'mapbox://styles/wompo/cjq4cbqju9k5a2sqmz8lwcepk'}
        preventStyleDiffing={true}
        onLoad={onMapLoad}
      >
        <div style={{position: 'absolute', right: 10, top: 5, zIndex: 100 }}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    )}
    </DeckGL>
    {renderTooltip()}
    <ControlPanel
      viewState={viewState}
      setViewState={setViewState}
    />
  </>
  )
}

export function renderToDom(container) {
  render(<App/>, container);
}
