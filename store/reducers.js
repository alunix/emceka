import {
  SET_MCKS,
  GET_MCK,
  SET_USER_LOGGED_IN,
  SEARCH_MCKS
} from './actionType'

const initialState = {
  mcks: [],
  mck: {},
  user: {},
  markers: [],
  searched: []
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_MCKS:
      return {
        ...state,
        mcks: action.payload
      }
    case GET_MCK:
      return {
        ...state,
        mck: action.payload
      }
    case SET_USER_LOGGED_IN:
      return {
        ...state,
        user: action.payload
      }
    case SEARCH_MCKS:
      return {
        ...state,
        searched: state.mcks.filter(mck => mck.name.toLowerCase().includes(action.payload))
      }
    default:
      return state
  }
}

export default reducers
