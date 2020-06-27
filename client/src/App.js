import React from 'react';
import './App.css';
import Img from 'react-exif-orientation-img'

class App extends React.Component {
  state = {
    queries : [],
    input : '',
    isLoading : false,
    results : [],
    offset : 0
  }


  async componentDidMount(){
    const response = await fetch('http://localhost:3000/recent')
    const result = await response.json();


    this.setState({
      queries : result
    })
  }

  handleChange = (e) => {
    this.setState({
      input : e.target.value
    })
  }

  handleOffsetChange = (e) => {
    this.setState({
      offset : e.target.value
    })
  }

   handleSubmit = async (e) => {
    const {input, offset} = this.state;
    this.setState({
      isLoading : true
    })

    const response = await fetch(`http://localhost:5000/search/${input}?offset=${offset}`)
    const result = await response.json();
    this.setState({
      results : result,
      isLoading : false
    })
  }

  handleSearch() {

  }

  render() {
    const {isLoading, results} = this.state
    return(
      <div>
        <center>
        <h1>Image Search Abstraction</h1>
      <label htmlFor="Term">TERM: </label>
      <input className="input" type="text" placeholder="Search for anything" onChange={this.handleChange} value={this.state.input} required/>
      <label htmlFor="offset">OFFSET: </label>
      <input className="input" type="number" placeholder="Offset" onChange={this.handleOffsetChange} value={this.state.offset} min="0" max="9" required/>
      
      <button className="search" type="submit" onClick={this.handleSubmit}>Search</button>
      <div className="content">
        {isLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : results.map((result, key) => {
          return (
            <div className="images" key={key}>
              <center>
              <Img className="img" src={result.url} alt={result.alt_text}/>
              </center>
            </div>
          )
        })}
      </div>
      </center>
      </div>

    )
  }

}
export default App;
