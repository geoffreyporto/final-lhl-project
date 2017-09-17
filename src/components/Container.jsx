import React from 'react'
import {GoogleApiWrapper} from 'google-maps-react'
import axios from 'axios'
import Map from './Map.jsx'
import Marker from './Marker.jsx'
import InfoWindow from './InfoWindow.jsx'
import querystring from 'querystring'

export class Container extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      dataLoaded: false
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
		this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.checkFavorite = this.checkFavorite.bind(this);
    this.getGoogleSearch = this.getGoogleSearch.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.getMapCoordinates = this.getMapCoordinates.bind(this);
    this.buttonId = '';
    this.buttonText = '';
    this.mapMarkers;
    this.mapCoords;
    this.searchQuery;
    this.resultSet;
    this.zoom = 13;
  }

  componentWillMount(){
    this.getGoogleSearch();
  }

  componentDidUpdate(){
  }

  getGoogleSearch() {
    axios.get('/map', {
    params: {
      user: localStorage.getItem('token')
    }
  })
    .then(result => {
      console.log("Route result:", result, "Data", result.data);
      this.getMapCoordinates(result.data[0]);
      this.getSearchQuery(result.data[1]);
      this.getResultSet(result.data[2]);
      //this.mapMarkers = this.renderMarkers(this.resultSet);
      this.setState({dataLoaded: true});
    })
  }

  getMapCoordinates(mapCoords) {
    this.mapCoords = {lat: mapCoords[0], lng: mapCoords[1]}
  }

  getSearchQuery(searchQuery) {
    this.searchQuery = searchQuery;
  }

  getResultSet(resultSet) {
    this.resultSet = resultSet;
  }

  renderMarkers(result) {
    // let markers = [];
    // let newResult;
    // for (let filter in result) {
    //   newResult = result[filter].map((place, i) => {
    //     return (
    //       <Marker key={i} keyword={filter} locationInfo={place} position={place.geometry.location} checkFavorite={this.checkFavorite} onClick={this.onMarkerClick} />
    //     )
    //   })
    //   markers = markers.concat(newResult);
    // }
    //console.log("new markers", markers);
    // return markers;
  }

  onMarkerClick(props, marker, e) {
    this.setState({
			selectedPlace: props,
			activeMarker: marker
		});
    this.checkFavorite(props.place_id);
	}

  checkFavorite(place_id) {
  axios.get('/favorites', {
    params: {
      user: localStorage.getItem('token'),
      place_id: place_id
    }
  })
  .then(result => {
    if (Number(result.data[0].count) > 0) {
      this.buttonId = 'remove';
      this.buttonText = 'Remove from Favorites'
    }
    else {
      this.buttonId = 'add';
      this.buttonText = 'Add to Favorites'
    }
    this.setState({showingInfoWindow:true});
  });
  }

  addFavorite () {
   this.buttonId = '';
   this.buttonText = 'Adding...';
   axios.post('/favorites/add', querystring.stringify({
      user: localStorage.getItem('token'),
      address: this.state.selectedPlace.formatted_address,
      name: this.state.selectedPlace.name,
      place_id: this.state.selectedPlace.place_id,
      price_level: this.state.selectedPlace.price_level,
      rating: this.state.selectedPlace.rating,
      latitude: this.state.selectedPlace.geometry.location.lat,
      longitude: this.state.selectedPlace.geometry.location.lng,
      query: "default"
    }))
  .then(result => {
    this.buttonId = 'remove';
    this.buttonText = 'Remove from Favorites';
    this.setState({showingInfoWindow:true});
  });
  }

  removeFavorite () {
   this.buttonId = '';
   this.buttonText = 'Removing...';
   axios.delete('/favorites/remove/', {params:
    {
      user: localStorage.getItem('token'),
      place_id: this.state.selectedPlace.place_id
    }
  })
  .then(result => {
    this.buttonId = 'add';
    this.buttonText = 'Add to Favorites';
    this.setState({showingInfoWindow:true});
  });
  }

  onInfoWindowClose() {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  }

  onMapClick() {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }

    let markers = [];
    let newResult;
    let count = 0;
    for (let filter in this.resultSet) {
      newResult = this.resultSet[filter].map((place, i) => {
        count += 1;
        return (
          <Marker keyword={filter} locationInfo={place} position={place.geometry.location} checkFavorite={this.checkFavorite} onClick={this.onMarkerClick} />
        )
      })
      markers = markers.concat(newResult);
    }

    const finalMarkers = markers;




    console.log('final markers', finalMarkers);

    const testData =
      { formatted_address: '908 Stewart St, Seattle, WA 98101, United States',
      geometry: { location: {lat: 37.774929, lng: -122.419416}, viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
      id: 'db3a1e206138a3253716bf6887d85c3e6ca9d6c4',
      name: 'FUCK YA',
      opening_hours: { open_now: true, weekday_text: [] },
      photos: [ [Object] ],
      place_id: 'DSKLDSKLDFKLSKLSD',
      price_level: 6,
      rating: 3.5,
      reference: 'CmRRAAAAmxPORwYQOikEwxqgokDgVPH06lKOUfssTMV9aXwyh9eGZ88KnZ3CHIZMXdbhq6DrBi2Ukmbihh5SBQC9ED1547TAQvx26Ujr1B2_0V0brZYaa458UgoEmfSu7KxtzLyXEhC-lRmFbwxOE3D0fb8hvaYUGhQndLBFcBzkecxb2qlaGipnM_KwMQ',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ] }

    const testData2 =
      { formatted_address: '908 Stewart St, Seattle, WA 98101, United States',
      geometry: { location: {lat: 37.794929, lng: -122.419416}, viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
      id: 'db3a1e206138a3253716bf6887d85c3e6ca9d6c4',
      name: 'FUCK YA',
      opening_hours: { open_now: true, weekday_text: [] },
      photos: [ [Object] ],
      place_id: 'DSKLDSKLDFKLSKLSD',
      price_level: 6,
      rating: 3.5,
      reference: 'CmRRAAAAmxPORwYQOikEwxqgokDgVPH06lKOUfssTMV9aXwyh9eGZ88KnZ3CHIZMXdbhq6DrBi2Ukmbihh5SBQC9ED1547TAQvx26Ujr1B2_0V0brZYaa458UgoEmfSu7KxtzLyXEhC-lRmFbwxOE3D0fb8hvaYUGhQndLBFcBzkecxb2qlaGipnM_KwMQ',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ] }

    if (finalMarkers !== [] && this.mapCoords) {
      return (
      <div style={style}>
        <Map google={this.props.google} onClick={this.onMapClick} initialCenter={this.mapCoords} zoom={this.zoom}>
        { finalMarkers }
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onInfoWindowClose}
            addFavorite={this.addFavorite}
            removeFavorite={this.removeFavorite}>
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
                <button id={this.buttonId}>{this.buttonText}</button>
              </div>
          </InfoWindow>
        </Map>
      </div>
    )
    }
    else {
      return (
      <div>Loading map...</div>
    )
    }
  }
}

export default GoogleApiWrapper({
  apiKey: process.env['API_KEY'],
  version: '3.29'
})(Container)
