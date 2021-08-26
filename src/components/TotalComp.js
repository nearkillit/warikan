import { useState } from "react";
import { useDispatch } from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton'

function Total(props){   
  const dispatch = useDispatch();  
  const [total, setTotal] = useState({ id: props.ts.id, price: props.ts.price, product: props.ts.product })

  const inputPrice = e => {    
    const price = e.target.value.replace(/\D/g, '');  
    const newTotal = { ...total, price, id: props.ts.id, product: props.ts.product }
    setTotal(newTotal)        
    dispatch({ type: 'UPDATE_HUMAN_TOTAL', payload: { id: props.hs.id, total: newTotal }})
  }

  const inputProduct = e => {    
    const product = e.target.value
    const newTotal = { ...total, product, id: props.ts.id, price: props.ts.price }
    setTotal(newTotal)    
    dispatch({ type: 'UPDATE_HUMAN_TOTAL', payload: { id: props.hs.id, total: newTotal }})
  }

  const deleteTotal = () => {            
    dispatch({ type: 'DELETE_HUMAN_TOTAL', payload: { id: props.hs.id, total:{ id: props.ts.id } }})    
  }

  const input = {
    width: "100%", /*親要素いっぱい広げる*/
    padding: "10px 15px", /*ボックスを大きくする*/
    fontSize: "16px",
    borderRadius: "3px", /*ボックス角の丸み*/
    border: "2px solid #ddd", /*枠線*/
    boxSizing: "border-box" /*横幅の解釈をpadding, borderまでとする*/
  }

    return (
      <tr className="TotalComp">                                     
        <td><input style={input} value={props.ts.price} onChange={inputPrice} placeholder="数字のみ" /></td>
        <td><input style={input} value={props.ts.product} onChange={inputProduct} placeholder="商品名" /></td>
        <td>  
          <IconButton aria-label="delete" onClick={deleteTotal}>
            <DeleteIcon/>          
          </IconButton>    
        </td>         
      </tr>
    )  
}

export default Total;