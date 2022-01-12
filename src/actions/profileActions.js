import axios from 'axios'
import { types } from '../types/types'
import {POST_USER} from '../enviroment'

export function profileUser(userId){
    return function(dispatch){
        axios.get(`${POST_USER}/${userId}`)
        .then((user) =>{
            dispatch({
                type: types.profileUser,
                payload: user.data
            })
        })
        .catch((error) => {
            console.log(error)
        })
}
}
