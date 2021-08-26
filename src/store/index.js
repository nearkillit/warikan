import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistState from "redux-localstorage";
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCDe9BVGp-xuXwA_bJnVZfjbtHX2AFw4fI",
  authDomain: "warikan-4ff01.firebaseapp.com",
  projectId: "warikan-4ff01",
  storageBucket: "warikan-4ff01.appspot.com",
  messagingSenderId: "794513327127",
  appId: "1:794513327127:web:ee11a576a87a0e9d4e8852",
  measurementId: "G-R317PN77RG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TITLE':            
      return { ...state,
                title: action.payload.title,
                makeDate: new Date()
      };
    case 'ADD_HUMAN':
      return { ...state,
                humans: [...state.humans, action.payload]
      };
    case 'ADD_HUMAN_TOTAL':         
      return {  ...state,
                humans: state.humans.map( h => h.id === action.payload.id ? 
                    { ...h, total:[ ...h.total, action.payload.total ] } : h ) }      
    case 'DELETE_HUMAN' :
      return { ...state,
                humans: state.humans.filter( h => !(h.id === action.payload.id) )}      
    case 'DELETE_HUMAN_TOTAL' :
      return { ...state, humans: state.humans.map( h => h.id === action.payload.id ? 
        { ...h, total: h.total.filter( t => !(t.id === action.payload.total.id) ) ,
                totalsum: h.total.reduce((a,c) =>  
                  c.id === action.payload.total.id ? a * 1 : a * 1 + c.price * 1 
                 , 0 ) } : h ) }
    case 'UPDATE_TITLE':            
      return { ...state,
                title: action.payload.title,                
      }; 
    case 'UPDATE_HUMAN_TOTAL' :
      return { ...state, humans: state.humans.map( h => h.id === action.payload.id ? 
        { ...h, total: h.total.map( t => t.id === action.payload.total.id ? action.payload.total : t ),
                totalsum: h.total.reduce((a,c) =>  
                  c.id === action.payload.total.id ? a * 1 + action.payload.total.price * 1 : a * 1 + c.price * 1
                 , 0 ), } : h ) }
    case 'UPDATE_USER' :        
      return {
        ...state, 
        login: action.payload.login,
        user: action.payload.user
      }
    case 'UPDATE_HID' :
      return {
        ...state,
        hid: action.payload.hid,  
        makeDate: action.payload.makeDate      
      }
    case 'FETCH_FIRE_DATE' :
      return { ...state,
                humans: action.payload.humans,
                title: action.payload.title,
                makeDate: action.payload.makeDate,
                hid: action.payload.hid
      }  
    default:
      return state;
  }
};

const localState = {
  login: false,
  user: {},  // displayName
  hid: '',  
}

const fireSaveState = {
  humans: [],  // human, id, total: { id, price, product }, totalsum
  title: '',
  makeDate: ''
}

const initialState = Object.assign(localState, fireSaveState);

const enhancer = compose(persistState(['humans','login','title','user','uid'], { key: 'warikan' }),applyMiddleware(thunk));

const store = createStore(reducer,                                                    
                          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
                          enhancer
                          );

export default store;