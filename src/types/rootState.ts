import { BasicReducerType } from 'store/app/basicReducer';
import { AccountReducerType } from 'store/account/accountReducer';
import { PoolReducerType } from 'store/pool/poolReducer';

export interface RootState {
    basic: BasicReducerType;
    account: AccountReducerType;
    pool: PoolReducerType;
}
