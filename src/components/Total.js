import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import TotalComp from "./TotalComp.js"
// material ui
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// icon
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles( theme => ({
  root: {       
    width: '100%',     
    backgroundColor: '#ccc'   
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
  },
  title: {
    fontWeight: 300,
    display: 'inline'
  },
  titleB: {
    fontWeight: 300,    
  }
}));

function Total(props){

  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector(state => state);    
  const [id, setId] = useState(0)
  const [total, setTotal] = useState({ price: 0, product: '', id })  

  const addTotal = () => {
    if(props.hs.total.length > 16){
      alert('17個以上、明細は作成できません')
      return
    }

    const newId = props.hs.total.reduce((a,c) => c.id > a ? c.id : a , 0) + 1  
    setId(newId)    
    const newTotal = {...total, id: newId }
    setTotal(newTotal)    
    dispatch({ type: 'ADD_HUMAN_TOTAL', payload: { id: props.hs.id, total: newTotal }})       
  }

  const deleteHuman = () => {    
    dispatch({ type: 'DELETE_HUMAN', payload: { id: props.hs.id }})    
  }  

  // human, id, total: { id, price, product }, totalsum
  const payment = (i, hid, human) => {
    const nowIndex = state.humans.findIndex(h => h.id === hid)   
    const payTotal = state.humans.map( () => 0)   
    const getTotal = state.humans.map( () => 0)   
    const average = Math.floor(state.humans.reduce((a,c) => a * 1 + c.totalsum * 1 , 0 ) / state.humans.length )
    const divisionReminder = state.humans.reduce((a,c) => a * 1 + c.totalsum * 1 , 0 ) % state.humans.length     
    const instanceTotal = state.humans.map(h => h.totalsum - average) 
    // average = 0　の場合
    const minusTotalHumans = instanceTotal.filter(h => h < 0).length  
    let mTHdR = minusTotalHumans > 0 ? divisionReminder % minusTotalHumans : divisionReminder
    const total = instanceTotal.map(h => {
      if(minusTotalHumans > 0){
        if(h < 0){
          h -= Math.floor( divisionReminder / minusTotalHumans )
          if(mTHdR > 0){
            h--
            mTHdR--
          }
        }
      }else{
        if(h <= 0 && mTHdR > 0){                    
            h--
            mTHdR--          
        }
      }              
      return h
    })       
    let infinityLoop = 0    

    while(!(total[nowIndex] === 0)){
      infinityLoop++
      if(infinityLoop > 1000000){ 
        alert('無限ループしてます')                
        break   
      }

      let max = Math.max(...total)
      let maxIndex = total.indexOf(max)
      let min = Math.min(...total)
      let minIndex = total.indexOf(min)

      if(max >= min * -1){
        total[maxIndex] += total[minIndex]
        total[minIndex] = 0  
        if(minIndex === nowIndex){
          payTotal[maxIndex] = min * -1
        }
        if(maxIndex === nowIndex){
          getTotal[minIndex] = min * -1
        }
      }else{
        total[minIndex] += total[maxIndex]
        total[maxIndex] = 0  
        if(minIndex === nowIndex){
          payTotal[maxIndex] = max
        }
        if(maxIndex === nowIndex){
          getTotal[minIndex] = max
        }        
      }               
      
    }

    //key={i + hid + human}
    return [      
        <TableCell align="center" key={i + 'A1'}>{human}</TableCell>,
        <TableCell align="center" key={i + 'A2'}>{payTotal[i].toLocaleString()}</TableCell>,
        <TableCell align="center" key={i + 'A3'}>{getTotal[i].toLocaleString()}</TableCell>        
    ]
  }  

  const inputTotal = {
    width: "100%",        
  }

  const inputTotalTitle = {
    color: "#eee",
    backgroundColor: "#777",    
  }

    return (   
      <Card className={clsx(classes.root, classes.margin)} variant="outlined">           
        <CardContent>
        <Typography variant="h4" component="h4" className={classes.title}>
          {props.hs.human}
        </Typography>               
        <IconButton aria-label="delete" onClick={deleteHuman}>
          <DeleteIcon/>          
        </IconButton>                                      
        <Typography variant="h6" component="h6" className={classes.titleB}>
          支払い合計金額:¥{ props.hs.total.reduce((a, c) =>                
           a * 1 + c.price * 1  , 0).toLocaleString()}
        </Typography>
        <TableContainer>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">対象の人</TableCell>
                <TableCell align="center">払う金額</TableCell>
                <TableCell align="center">もらう金額</TableCell>            
              </TableRow>
            </TableHead>
            <TableBody>
            { state.humans.map( (h,i) => {                                          
                if(h.id !== props.hs.id){
                  return (
                    <TableRow key={h.id + 'A' + i}>
                      {payment(i, props.hs.id, h.human)}
                    </TableRow>
                  )
                }else{
                  return (
                  <TableRow key={h.id + 'A' + i}>
                    <TableCell align="center">{h.human}(自分)</TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">-</TableCell>   
                  </TableRow>   
                  )   
                }                                            
              })
            }
            </TableBody>
          </Table>
        </TableContainer>                             
        <table style={inputTotal}>
          <thead>
            <tr style={inputTotalTitle}>            
              <th>支払った金額</th>
              <th>商品名</th>
              <th>削除</th>
            </tr>            
          </thead>
          <tbody>
            { props.hs.total.map( (t, i) => (
              <TotalComp hs={props.hs} ts={t} key={t.id + 'A' + i} />
            ))}  
          </tbody>            
        </table>       
        <IconButton aria-label="add-human" onClick={addTotal}>
            <AddIcon/>            
          </IconButton>           
        </CardContent>
      </Card>
    )  
}

export default Total;