/*
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
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactMapGL, {FlyToInterpolator, NavigationControl} from 'react-map-gl'; //, 
import DeckGL, {GeoJsonLayer} from 'deck.gl';
import {MapboxLayer} from "@deck.gl/mapbox";

import ControlPanel from './ControlPanel';

import geomap from './geologielimburg.json';
import key from './key.json'

const MAPBOX_TOKEN = 'pk.eyJ1Ijoid29tcG8iLCJhIjoiY2pwd3NweXAwMHgzejQzbW11cG9ucWY4ZiJ9.S9-VQRVZ_DWo-b2DhXWPYA'; // Set your mapbox token here

export default class App extends Component {

  constructor(props) {
    super(props);
    this._onHover = this._onHover.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._goToViewport = this._goToViewport.bind(this);
  }

  state = {
    mapStyle: 'mapbox://styles/wompo/cjq4cbqju9k5a2sqmz8lwcepk',
    viewState: {
      longitude: 5.850884,
      latitude: 50.864828,
      zoom: 10,
      maxZoom: 16,
      pitch: 15,
      bearing: 0
    }
  };

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;
    return (
      hoveredObject && (
        <div className="tooltip" style={{top: y, left: x, zIndex: 1000}}>
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

  _goToViewport = ({latitude, longitude, zoom}) => {
    // console.log("going to viewport");
    this.setState({
      viewState: {
        ...this.state.viewState,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        longitude,
        latitude,
        zoom,
        pitch: 10
      }
    });
  };

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  _changeMapStyle = (mapStyle) => {
    this.setState({mapStyle});
  }

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  // Add deck layer to mapbox
  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    map.addLayer(new MapboxLayer({id: 'geologicalmap', deck}), 'waterway-label');
  }

  _renderLayers() {
    const {data = geomap} = this.props;
    return [
        new GeoJsonLayer({
          id: 'geologicalmap',
          data,
          opacity: 0.4,
          stroked: true,
          filled: true,
          fp64: true,
          getFillColor: f => key[f.properties.KRTCODE].color.split(','),
          getLineColor: [255, 255, 255, 59],
          pickable: true,
          onHover: this._onHover
        })
      ];
  }

  render() {
    const {gl, viewState, mapStyle} = this.state;
    const {controller = true} = this.props;

    return (
      <>
        <DeckGL
          width={"70%"}
          ref={ref => {this._deck = ref && ref.deck;}}
          layers={this._renderLayers()}
          viewState={viewState}
          onViewStateChange={this._onViewStateChange}
          controller={controller}
          onWebGLInitialized={this._onWebGLInitialized}
        >
          {gl && (
            <ReactMapGL
              ref={ref => { this._map = ref && ref.getMap(); }} // save a reference to the mapboxgl.Map instance
              gl={gl}
              onLoad={this._onMapLoad}
              reuseMaps
              mapStyle={mapStyle}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              visibilityConstraints={{ minZoom: 10, maxZoom: 14, minPitch: 0, maxPitch: 60 }}
            >
              <NavigationControl onViewportChange={this._onViewStateChange} />
            </ReactMapGL>
          )}
          {this._renderTooltip()}
        </DeckGL>
        <ControlPanel
          containerComponent={this.props.containerComponent}
          goToViewport={this._goToViewport}
          changeMapStyle={this._changeMapStyle}
        />
      </>
    );
  }
}

export function renderToDom(container) {
  render(<App/>, container);
}