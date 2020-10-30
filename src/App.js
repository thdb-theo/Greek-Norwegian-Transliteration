import React, { Component } from 'react';
import Keyboard from 'react-simple-keyboard';

import greek_flag from './greek_flag.gif';
import russian_flag from './russian_flag.gif';

import './App.css';
import 'react-simple-keyboard/build/css/index.css';
import { Greek, greek_acute, diaeresis, acute_diaresis } from './greek'
import { greeklayout, russianlayout } from './layouts'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      layoutName: "default",
      modifier: '',
      language: "",
      greekTranscriber: new Greek(""),
      russianTranscriber: null,
      title: "",
      undertitle: null,
      placeholder: null
    }
    // this.toGreek()
  }

  componentDidMount() {
    this.toGreek()
  }

  changeGreek = (event) => {
    this.setState({ text: event.target.value })
    this.state.greekTranscriber.setString(event.target.value)
  }

  KBonChange = (input) => {
    this.forceUpdate()
  }

  KBonKeyPress = (button) => {
    if (["{lock}", "{shift}"].includes(button)) {
      this.handleShiftButton();
      this.state.greekTranscriber.setString(this.state.text)
      this.forceUpdate()
      return;
    }
    if (button === "΄") {
      this.setState({ modifier: "acute" })
      return
    }
    if (button === "¨") {
      this.setState({ modifier: "diaeresis" })
      return
    }

    if (button === "΅") {
      this.setState({ modifier: "acute_diaeresis" })
      return
    }

    if (this.state.modifier === "acute" && button.toLowerCase() in greek_acute) {
      let accented = greek_acute[button.toLowerCase()]
      if (button === button.toUpperCase())
        button = accented.toUpperCase()
      else
        button = accented
    }
    if (this.state.modifier === "diaeresis" && button.toLowerCase() in diaeresis) {
      let accented = diaeresis[button.toLowerCase()]
      if (button === button.toUpperCase())
        button = accented.toUpperCase()
      else
        button = accented
    }
    if (this.state.modifier === "acute_diaeresis" && button.toLowerCase() in acute_diaresis) {
      let accented = acute_diaresis[button.toLowerCase()]
      if (button === button.toUpperCase())
        button = accented.toUpperCase()
      else
        button = accented
    }

    this.setState({ modifier: "" })
    if (button === "{space}")
      button = " "
    if (button === "{delete}") {
      this.setState({ text: "" })
      this.state.greekTranscriber.setString("")
      this.forceUpdate()
      return
    }
    if (button === "{bksp}") {
      this.setState({ text: this.state.text.slice(0, -1) })
      this.state.greekTranscriber.setString(this.state.text)
    } else {
      this.setState({ text: this.state.text + button })
      this.state.greekTranscriber.setString(this.state.text)
    }
  }
  handleShiftButton = () => {
    const shiftToggle = this.state.layoutName === "default" ? "shift" : "default";
    this.setState({ layoutName: shiftToggle });
  };

  toGreek = () => {
    this.setState({
      language: "greek",
      title: "Transliterasjon av nygresk",
      undertitle: "Μεταγραφής από το Ελληνικό στο Νορβηγός",
      placeholder: "Dette er jo helt gresk!"
    })
  }

  toRussian = () => {
    this.setState({
      language: "russian",
      title: "Transliterasjon av russisk",
      undertitle: "транслитерация с русского на норвежский",
      placeholder: "Russisk funker ikke ennå. Work in progress!"
    })
  }

  render() {
    let isgreek = this.state.language === "greek"
    return (
      <div className="App">
        <div className="App-header">
          <img src={greek_flag} onClick={this.toGreek} className={isgreek ? "mainflag" : "altflag"} alt="logo" />
          <img src={russian_flag} onClick={this.toRussian} className={isgreek ? "altflag" : "mainflag"} alt="logo" />
          <h2>{this.state.title}</h2>
          <h3>{this.state.undertitle}</h3>
        </div>

        <div className="Greek-form">
          <form>
            <input type="text"
              value={this.state.text}
              onChange={this.changeGreek}
              placeholder={this.state.placeholder} />
          </form>
          <p>&nbsp;{this.state.greekTranscriber.norwegian()}</p>
        </div>
        <Keyboard
          onChange={this.KBonChange}
          onKeyPress={this.KBonKeyPress}
          layoutName={this.state.layoutName}
          buttonTheme={[]}
          physicalKeyboardHighlight
          layout={isgreek ? greeklayout : russianlayout}
        />
        <div className="footer"
        >
          <p>Theodor Tollersrud 2020 &copy;</p>
        </div>
      </div>
    );
  }
}

export default App;
