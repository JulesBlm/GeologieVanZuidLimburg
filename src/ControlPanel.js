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
        console.log("Component mounted. Should init timescale")
        timescale.init("timescale");
    }

    handleClick() {
        const { index } = this.state;
        if (index > -1 && index < plaatsen.length - 1 ) {
            this.setState((prevState) => {
                return { index: prevState.index+1 };
            });
         
            const place = plaatsen[this.state.index + 1];
            this.props.goToViewport(place);
            if (place.mapstyle) { this.props.changeMapStyle(place.mapstyle); }; ////"mapstyle": "mapbox://styles/mapbox/satellite-streets-v9"
            timescale.goTo(place.period);
        }
    }
  
    render() {
        const Container = this.props.containerComponent || defaultContainer;
        const currentPlace = plaatsen[this.state.index];
        console.log(this.state.index);

        return (
            <Container>
                <div className="text">
                    <h2>{currentPlace.name}</h2>
                    <h3>{currentPlace.period}</h3>
                    <p>
                        {currentPlace.description}
                    </p>
                    <button onClick={() => this.handleClick()} className="control"> Vorige </button>
                    <button onClick={() => this.handleClick()} className="control"> Volgende </button>
                </div>
                <div id="timescale"></div>
            </Container>
        );
  }
}