import React, {PureComponent} from 'react';
import timescale from './timescale';

import plaatsen from './plaatsen.json';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {
  
    constructor(props) {
        super(props);    
        this.handleClick = this.handleClick.bind(this);
    }

    state = { 
        index: 0
    }

    componentDidMount() {
        timescale.init("timescale");
    }

    handleClick(amount) {
        const { index } = this.state;
        if (index => 0 && index < plaatsen.length - 1 ) {
            this.setState((prevState) => {
                return { index: prevState.index+amount };
            });
         
            const place = plaatsen[this.state.index + amount];
            this.props.goToViewport(place);
            if (place.mapstyle) { this.props.changeMapStyle(place.mapstyle); }; ////"mapstyle": "mapbox://styles/mapbox/satellite-streets-v9"
            timescale.goTo(place.period);
        }
    }
  
    render() {
        const Container = this.props.containerComponent || defaultContainer;
        const currentPlace = plaatsen[this.state.index];
        // console.log("index", this.state.index);

        return (
            <Container>
                <div className="text">
                    <h2>{currentPlace.name}</h2>
                    <h3>{currentPlace.period}</h3>
                    <p dangerouslySetInnerHTML={ {__html:currentPlace.description} } />
                </div>
                <div id="button-bar">
                    <button
                        onClick={() => this.handleClick(-1)}
                        className="control"
                        disabled={this.state.index === 0}>
                        Vorige
                    </button>
                    <button 
                        onClick={() => this.handleClick(1)} 
                        className="control"
                        disabled={this.state.index === plaatsen.length}>
                        Volgende
                    </button>
                </div>
                <div id="timescale"></div>
            </Container>
        );
  }
}