import React, { setState } from 'react';
import Appheader from './components/header';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Button, Label } from 'reactstrap';
import { Container, InputGroup, InputGroupAddon, Input, Row, Col } from 'reactstrap';
import axios from 'axios';
import currencyToSymbolMap from 'currency-symbol-map/map';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      valuefrom: ['USD'],
      valueto: ['EUR'],
      statusOptions: [],
      calculated: '0.00',
      inputvalue: '',
      errormessage: '',
      from: '',
      to: ''
    }
    this.handleChangefrom = this.handleChangefrom.bind(this);
    this.handleChangeto = this.handleChangeto.bind(this);
    this.handleinputchange = this.handleinputchange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }



  /*

  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.axios = this.componentDidMount.bind(this);*/


  componentDidMount() {
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then((response) => {
        // handle success
        console.log(response.data.rates);
        const data = Object.keys(response.data.rates);
        var v = [];
        for (var i = 0; i < data.length; i++) {
          var s = {};
          s.value = data[i];
          s.label = data[i];
          v.push(s);
        }

        this.setState({ statusOptions: v });
      });
  }

  handleChangefrom(event) {
    this.setState({ valuefrom: event.target.value });
    this.setState({ from: event.target.value });
  }
  handleChangeto(event) {
    this.setState({ valueto: event.target.value });
    this.setState({ to: event.target.value });
  }
  handleinputchange(event) {
    var patt1 = /[1-9]/g;
    if (event.target.value.match(patt1) !== null) {
      console.log('not null');
      var v = +parseFloat(event.target.value);
      v = v.toFixed(5);
      this.setState({ inputvalue: event.target.value });
      this.setState({ errormessage: "" });
    } else {

      this.setState({ inputvalue: event.target.preventDefault });
      this.setState({ errormessage: "Enter Valid number" });
    }

  }


  handleSubmit(event) {
    event.preventDefault();
    var patt1 = /[1-9]/g;
    var value = this.state.inputvalue;
    if (this.state.inputvalue.length === 0 || this.state.inputvalue === '0') {
      this.setState({ errormessage: "Please Enter the Value to Convert" });
    } else {
      if (value.match(patt1) !== null) {
       
        var v = +parseFloat(value);
        v = v.toFixed(2);

        axios.get('https://api.exchangerate-api.com/v4/latest/'+this.state.valuefrom)
        .then((response)=>{
                if(response.status===200){
                  var tovalue = parseFloat(response.data.rates[this.state.valueto]);
                    var answer = (v*tovalue).toFixed(2);
                    this.setState({calculated: answer+' '+currencyToSymbolMap[this.state.valueto]});
                }
                
              
        });
      }else{
        this.setState({ errormessage: "Enter Valid number" });
      }

    }
  }


  render() {

    return (
      
      <div className="App">
 <Appheader />

        <Container className="maincontainer">
          <Row className="mb-4">
            <Col>
              <select
                className="selectclass"
                type="text"
                value={this.state.valuefrom}
                onChange={this.handleChangefrom}>
                {this.state.statusOptions.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
              </select>

            </Col>

            <Col>
              <p>To</p>
            </Col>
            <Col>
              <select 
              className="selectclass"
                            value={this.state.valueto} onChange={this.handleChangeto}>
                {this.state.statusOptions.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}

              </select>
            </Col>

          </Row>
          <Row>
            <Col style={{ color: 'red', float: 'left' }}>
              <InputGroup>
                <Input onChange={this.handleinputchange} />
                <InputGroupAddon addonType="append"><Button onClick={this.handleSubmit} color="success">Convert</Button></InputGroupAddon>

              </InputGroup>
              <p style={{ color: 'red', float: 'left' }}>{this.state.errormessage}</p>
            </Col>

          </Row>

          <Row className="mt4">
            <Col className="mt4 result">
              <h1>{this.state.calculated}</h1>
            </Col>
          </Row>
        </Container>

        <Row className="footer">
        <Col>
        </Col>

        </Row>
        
      </div>
    );

  }
}

export default App
