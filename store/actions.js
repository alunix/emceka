import {
  SET_MCKS,
  GET_MCK,
  SET_USER_LOGGED_IN,
  SEARCH_MCKS
} from './actionType'

export const setMcks = (mcks) => {
  return {
    type: SET_MCKS,
    payload: mcks
  }
}

export const getMck = (mck) => {
  return {
    type: GET_MCK,
    payload: mck
  }
}

export const setUserLoggedIn = (user) => {
  return {
    type: SET_USER_LOGGED_IN,
    payload: user
  }
}

export const searchMcks = (query) => {
  return {
    type: SEARCH_MCKS,
    payload: query
  }
}
