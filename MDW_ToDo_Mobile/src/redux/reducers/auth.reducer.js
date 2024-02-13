/* eslint-disable prettier/prettier */

import isEmpty from "../../utils/isEmpty"
import { SET_USER,SET_FIRST_LOGIN} from "../types"

const initialState = {
    isConnected: false,
    isLoading: false,
    isVerified: false,
    user: {},
    isFirstTime:false,

}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                isConnected: !isEmpty(action.payload),
                user: action.payload,
                isLoading: isEmpty(action.payload),

                isFirstTime : action.payload?.firstLogin
            }
            case SET_FIRST_LOGIN:
                return {
                    ...state,
                    isFirstTime: action.payload
                }
        default:
            return state
    }

}


