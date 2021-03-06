import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// material ui
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import BackupIcon from '@material-ui/icons/Backup';
import PublishIcon from '@material-ui/icons/Publish';
// import TouchAppIcon from '@material-ui/icons/TouchApp';

function FireAccount(){    
    const dispatch = useDispatch();
    const state = useSelector(state => state);

    const login = () => {        
        const google_auth_provider = new firebase.auth.GoogleAuthProvider();        
        firebase.auth().signInWithRedirect(google_auth_provider)                               
        // window.localStorage.removeItem('vuex');
    }

    const logout = () => {                
        firebase.auth().signOut().then( () => {
            console.log('logout');
            dispatch({ type: 'UPDATE_USER', payload: { login: false, user: {}}})    
        })        
    }
    
    firebase.auth().onAuthStateChanged( user => {        
            if(user && !state.login){                                       
                dispatch({ type: 'UPDATE_USER', payload: { login: true, user }})                    
            }                  
          })  
    
    const setFireHumans = () => {
        if(!(!state.title || state.title === '')){    
            const newDate = new Date()            
            firebase
                .firestore()
                .collection(`users/${state.user.uid}/humans`)                     
                .add({ 
                    humans: state.humans,
                    title: state.title,
                    makeDate: newDate
                })          
                .then( (querySnapshot) => {                                       
                    dispatch({ type: 'UPDATE_HID', payload: { hid: querySnapshot.id, makeDate: newDate }})
                    alert('????????????!')
                }) 
        }else{
            alert('???????????????????????????????????????')
        }       
    }
    const fetchFireHumans = () => {            

        firebase.firestore()
            .collection(`users/${state.user.uid}/humans`)
            .get()
            .then( querySnapshot => {
                if(querySnapshot.empty) alert('???????????????????????????????????????');
                else{
                    let beforeDate = 0
                    let newData = {}

                    querySnapshot.forEach( doc => {                    
                        if( doc.data().makeDate.seconds > beforeDate ){
                            beforeDate = doc.data().makeDate.seconds
                            newData = doc.data()
                            newData.hid = doc.id
                        }
                    })
                    
                    dispatch({ type: 'FETCH_FIRE_DATE', payload: { 
                                                                    humans: newData.humans, 
                                                                    title: newData.title,  
                                                                    hid: newData.hid,
                                                                    makeDate: newData.makeDate
                                                                }})  
                    alert('????????????????????????')
                }
            })
    }

    // const timestampToTime = (timestamp) => {
    //     const date = new Date(timestamp * 1000);
    //     const yyyy = `${date.getFullYear()}`;
    //     // .slice(-2)???????????????????????????2?????????????????????
    //     // `0${date.getHoge()}`.slice(-2) ????????????????????????????????????
    //     const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()???????????????0?????????
    //     const dd = `0${date.getDate()}`.slice(-2);
    //     const HH = `0${date.getHours()}`.slice(-2);
    //     const mm = `0${date.getMinutes()}`.slice(-2);
    //     const ss = `0${date.getSeconds()}`.slice(-2);
      
    //     return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
    //   }

    useEffect(() => {
        if(state.user && state.user.displayName){
            // fetchFireHumans()            
        }
    },[state.user])  

    return (
        <div>
            { (state.user && state.user.displayName) ?
            <span>
                <Button onClick={logout}>
                    <LockIcon />Logout
                </Button>
                <Button onClick={setFireHumans}>
                    <BackupIcon />????????????????????????
                </Button>
                <Button onClick={fetchFireHumans}>
                    <PublishIcon />????????????????????????
                </Button>                         
            </span>            
            :
            <div>                
                <span>
                    Google???????????????????????????????????????
                </span>                                    
                <Button onClick={login}>
                    ?????????<LockOpenIcon />
                </Button>                 
            </div>                         
            }            
        </div>
    )
}

export default FireAccount;