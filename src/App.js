import React, {useReducer, useEffect} from 'react';
import './App.css';

const reducer = (state, action) => {
  switch(action.type){
    case 'addNote':
      return state.includes(action.payload.note) ? state : [...state, action.payload.note];
    case 'removeNote':
      return state.filter(note => note !== action.payload.note);
    default:
      return state;
  }
}

const ALLNOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]


const getNoteName = code =>{
  return ALLNOTES[code % 12]
}

const getOctave = code => {
  return Math.floor((code - 9) / 12)
}

function App() {
  const [notes, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      console.log('This browser supports WebMIDI!');
  
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  
    } else {
        console.log('WebMIDI is not supported in this browser.');
    }
  }, [])

  function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
  
    // Attach MIDI event "listeners" to each input
    for (var input of inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
  }
  
  // Function to run when requestMIDIAccess fails
  function onMIDIFailure() {
    console.log('Error: Could not access MIDI devices.');
  }
  
  // Function to parse the MIDI messages we receive
  // For this app, we're only concerned with the actual note value,
  // but we can parse for other information, as well
  function getMIDIMessage(message) {
  
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  
    switch (command) {
        case 144: // note on
            if (velocity > 0) {
                noteOn(note);
            } else {
                noteOff(note);
            }
            break;
        case 128:
        default:
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  }
  
  
  function noteOn(note) {
    dispatch({type: 'addNote', payload: {note}})
  }
  
  
  function noteOff(note) {
    dispatch({type: 'removeNote', payload: {note}})
  }

  return (
    <div id="notes">
      {notes.map(n => <div className="note">{getNoteName(n)}<sup>{getOctave(n)}</sup></div>)}
    </div>
  )
    
}

export default App;
