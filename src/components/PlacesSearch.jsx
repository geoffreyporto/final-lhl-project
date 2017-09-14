import React from 'react'
import ReactDOM from 'react-dom'
import camelize from '../javascript/camelize.js'

export class PlacesSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      googleLoad: false
    }
  }

  loadSearch(){
    if (this.props && this.props.google) {
      // if google is available
      const {google} = this.props;
      const maps = google.maps;
      const node = ReactDOM.findDOMNode(this.refs.autocomplete);
      const searchBox = new maps.places.SearchBox(node);
      // searchBox.addListener('places_changed', function() {
      //     let places = searchBox.getPlaces();
      //     if (places.length == 0) {
      //       return;
      //     }
      this.setState({googleLoad: true})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadSearch();
    }
  }

  render(){
    return (
      <input ref='autocomplete' id="pac-input" className="controls" type="text" placeholder="Search Box" ref={(destination) => this.destination = destination}/>
    )
  }

}

export default PlacesSearch;
