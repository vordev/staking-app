import { combineReducers } from "redux";
import { basicReducer } from "store/app/basicReducer";
import { accountReducer } from "store/account/accountReducer";
import { poolReducer } from "store/pool/poolReducer";

const appReducer = combineReducers({
    basic: basicReducer,
    account: accountReducer,
    pool: poolReducer,
});

export default (state: any, action: any) => {
    return appReducer(state, action);
}
