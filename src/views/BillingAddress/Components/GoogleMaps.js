import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { IconZoom } from 'assets/icons';
import { Row, Col } from 'reactstrap';
import iconPin from 'assets/icons/iconPin.png'
const dotenv = require('dotenv');
dotenv.config();
const GoMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',

      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},

      // UT Location
      mapCenter: {
        lat: -6.183562733679283,
        lng: 106.93109719669702
      },
      containerStyle: {
        maxWidth: '460px',
        height: '400px',
        position: 'relative'
      },
      style: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        marginTop: '1rem'
      },
      // Dummy Suggestion
      suggestions: [
        {
          "title": "PT Pama Persada Nusantara  Banjarmasin",
          "description": "KM 30. 5 Payung Banjarnaru, Jl. A. Yani, Guntung Paikat, Kec. Landasan Ulin, Kota Banjar Baru, Kalimantan Selatan 70721"
        },
        {
          "title": "PT Pama Persada Nusantara  Banjarmasin",
          "description": "KM 30. 5 Payung Banjarnaru, Jl. A. Yani, Guntung Paikat, Kec. Landasan Ulin, Kota Banjar Baru, Kalimantan Selatan 70721"
        },
        {
          "title": "PT Pama Persada Nusantara  Banjarmasin",
          "description": "KM 30. 5 Payung Banjarnaru, Jl. A. Yani, Guntung Paikat, Kec. Landasan Ulin, Kota Banjar Baru, Kalimantan Selatan 70721"
        },
      ] 
    };
  }


  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {})
      .catch(error => {});
  };



  render() {
    return (
      <div>
        <Row className="conSearchPinPoint ml-0">
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <>
                <input
                  {...getInputProps({
                    placeholder: 'Tulis jalan / perumahan / Kelurahan',
                    className: 'formSearch',
                  })}
                  className="formSearch"
                />
                <div>
                  {loading && <div>Loading...</div>}
                    <div className="conSuggestion">
                      {this.state.suggestions.map((suggestion, index) => (
                      <Row key={index}>
                        <Col md={1}>
                          <img 
                            height={15.5} 
                            width={11} 
                            src={iconPin} 
                            alt="iconPin"
                            className="ml-2"
                            />
                        </Col>
                        <Col md={11}>
                          <span className="suggesTitle p-0 m-0">{suggestion.title}</span>
                          <p className="suggesDesc p-0 m-0">{suggestion.description}</p>
                          <hr style={{ borderTop: '1px solid #000000', opacity: '0.15', marginTop: 0, width: '100%' }}></hr>
                        </Col>
                      </Row>
                      ))}
                    </div>
                </div>
              </>
            )}
          </PlacesAutocomplete>
          <div className="conIconSearch px-2">
            <img style={{ height: 12, width: 12 }} src={IconZoom} alt="searchIcon" />
          </div>
        </Row>
        <Map google={this.props.google}
          initialCenter={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
          center={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
          zoom={15}
          containerStyle={this.state.containerStyle}
          style={this.state.style}
        >
          <Marker
            position={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }}
          />
        </Map>
        <span className="mapsText">KM 30. 5 Payung Banjarnaru, Jl. A. Yani, Guntung Paikat, Kec. Landasan Ulin, Kota Banjar Baru, Kalimantan Selatan 70721</span>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (GoMapsApiKey)
})(MapContainer)