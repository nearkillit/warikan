import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';

const useStyles = makeStyles( theme => ({
  root: {       
    width: '100%'    
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "55%",
  },  
  textInput: {
    fontSize: "36px",
    fontWeight: "bold",    
  }
}));

function Title(props){   
  const dispatch = useDispatch();    

  const inputTitle = e => {    
    const title = e.target.value        
    dispatch({ type: 'UPDATE_TITLE', payload: { title }})
  }

  const classes = useStyles();

    return (
      
      <div className="TotalComp">            
        <TextField value={props.t} onChange={inputTitle}
            label="イベント名"          
            className={clsx(classes.margin, classes.textField)}     
            InputProps = {{
              classes: {
                input: classes.textInput
              }
            }}   
            inputProps={{
              maxLength: 18
            }}
          />
      </div>
    )  
}

export default Title;