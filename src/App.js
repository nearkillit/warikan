import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Total from "./components/Total";
import FireAccount from "./components/FireAccount.js"
import Title from "./components/Title"
// material ui
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles( theme => ({
  root: {       
    width: '100%'    
  },
  margin: {
    margin: theme.spacing(1),
  },
  marginT: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "40%",
  },  
  textInput: {
    fontSize: "20px",
    fontWeight: "700",    
  },
  title: {
    fontWeight: 300
  }, 
}));

function App() {  
  const classes = useStyles();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  
  const [human, setHuman] = useState('')   

  const inputText = (e) => {    
    setHuman(e.target.value) 
  }  

  const addHuman = () => {
    if(human === ''){
      alert('人の名前が記入されていません')
      return
    }

    if(state.humans.length > 12){
      alert('13人以上は登録できません')
      return
    }    
    const newId = state.humans.reduce((a,c) => c.id > a ? c.id : a , 0) + 1        
    dispatch({ type: 'ADD_HUMAN', payload: { human, id: newId, total: [{ price: 0, product: '', id: 0 }], totalsum: 0 }})    
  }   

  useEffect(() => {
    
  },[human])    

  const TotalBox = {
    display: "flex",
    flexWrap: "wrap"
  }

  return (
    <div className="App">
      <Typography variant="h2" component="h2" className={classes.title}>
        割り勘アプリ
      </Typography>
      <Typography variant="h4" component="h4" className={classes.title}>
        {(state.user && state.user.displayName) ? 'ようこそ！　' + state.user.displayName + 'さん' : ''}
      </Typography>         
      <FireAccount />    
      <Title t={state.title}/>
      { !(!state.title || state.title === '') ?
        <div>
          <div>
          <TextField onChange={inputText}
            label="追加する人の名前"          
            className={clsx(classes.margin, classes.textField)}     
            InputProps = {{
              classes: {
                input: classes.textInput
              }
            }}     
            inputProps={{
              maxLength: 16
            }}  
          />
          <IconButton aria-label="add-human" onClick={addHuman} className={clsx(classes.marginT)}>
            <AddIcon fontSize="large"/>            
          </IconButton>           
          </div>
          <Typography variant="h4" component="h4" className={classes.title}>
            合計金額：¥{state.humans.reduce((a,c) => a + c.totalsum ,0).toLocaleString()}
          </Typography>               
          <div style={TotalBox}>
            {state.humans.map(( h, i ) => (
              <Total hs={h} key={h.id + 'A' + i} />
            ))}                
          </div>
        </div> 
        :        
        <Typography variant="h4" component="h4" className={classes.title}>
          割り勘したいイベント名を入力してください
        </Typography>             
      }            
    </div>
  )
}


export default App;