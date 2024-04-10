import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import { courseReducer, courseDetailReducer } from './reducers/courseReducer';



const rootReducer = combineReducers({
    auth: authReducer,

    course: courseReducer,
    courseDetail: courseDetailReducer,


});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;


