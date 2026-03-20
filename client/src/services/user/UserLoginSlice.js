import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { setOrderReset } from '../order/OrderListSlice';
import { setAdminReset } from './UserListSlice';

let userInfoFromStorage = null;
try {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
        userInfoFromStorage = JSON.parse(storedUserInfo);
    }
} catch (error) {
    console.error("Error parsing userInfo from storage", error);
    localStorage.removeItem("userInfo");
}

const initialState = {
    userInfo: userInfoFromStorage,
    loading: null,
    error: null,
}

const UserLoginSlice = createSlice({
    name: "userLogin",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setUserReset: (state) => {
            state.userInfo = null
            state.loading = null
            state.error = null
        }
    }
});

export const { setLoading, setUserInfo, setError, setUserReset } = UserLoginSlice.actions

export default UserLoginSlice.reducer

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios.post("/api/users/login", { email, password }, config)
        dispatch(setLoading(false))
        dispatch(setUserInfo(data))
        localStorage.setItem("userInfo", JSON.stringify(data))
    } catch (error) {
        dispatch(setLoading(false))
        const err = error.response && error.response.data.message ? error.response.data.message : error.message
        dispatch(setError(err))
    }
}

export const googleLogin = (idToken) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios.post("/api/users/google", { idToken }, config)
        dispatch(setLoading(false))
        dispatch(setUserInfo(data))
        localStorage.setItem("userInfo", JSON.stringify(data))
    } catch (error) {
        dispatch(setLoading(false))
        const err = error.response && error.response.data.message ? error.response.data.message : error.message
        dispatch(setError(err))
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("paymentMethod")
    dispatch(setUserReset())
    dispatch(setOrderReset())
    dispatch(setAdminReset())
}

export const refreshUserProfile = () => async (dispatch, getState) => {
    try {
        const { userLogin: { userInfo } } = getState()
        if (!userInfo) return

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get("/api/users/profile", config)
        // Profile endpoint usually doesn't return the token again, so merge
        const updatedUserInfo = { ...userInfo, ...data }
        dispatch(setUserInfo(updatedUserInfo))
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
    } catch (error) {
        console.error("Profile refresh failed", error)
        if (error.response?.status === 401) {
            dispatch(logout())
        }
    }
}
