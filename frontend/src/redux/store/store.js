import { configureStore } from '@reduxjs/toolkit';
import roleReducer from '../slice/slice'

const store = configureStore({
    reducer : {
        role: roleReducer
    }
})

export default store;