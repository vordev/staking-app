import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from 'types';

import Config from 'config';
import { web3client } from 'lib';
import {
  poolSetPoolInfo,
  poolSetContract,
  poolSetStakeTokenInfo,
  poolSetStakeTokenContract,
  poolLoadAllowance,
  poolGetPeriodFinish,
  poolSetRewardTokenInfo,
  poolSetRewardTokenContract,
} from 'store/pool/poolActions';
import PoolComposition from './PoolComposition';

interface StateFromProps {}
interface DispatchFromProps {
  setPoolInfo: typeof poolSetPoolInfo;
  setStakeTokenInfo: typeof poolSetStakeTokenInfo;
  setPoolContract: typeof poolSetContract;
  setStakeTokneContract: typeof poolSetStakeTokenContract;
  setRewardTokenInfo: typeof poolSetRewardTokenInfo;
  setRewardTokenContract: typeof poolSetRewardTokenContract;
  loadAllowance: typeof poolLoadAllowance;
  loadPeriodFinish: typeof poolGetPeriodFinish;
}

type Props = StateFromProps & DispatchFromProps;

const Pool2Composition: React.FC<Props> = ({
  setPoolInfo,
  setStakeTokenInfo,
  setPoolContract,
  setStakeTokneContract,
  setRewardTokenInfo,
  setRewardTokenContract,
  loadAllowance,
  loadPeriodFinish,
}) => {

  useEffect(() => {
    setPoolInfo(Config.Pool2);
    setStakeTokenInfo(Config.NerdzLpToken);
    setPoolContract(web3client.pool2Contract);
    setStakeTokneContract(web3client.nerdzLpTokenContract);
    setRewardTokenInfo(Config.Token);
    setRewardTokenContract(web3client.tokenContract);
    loadAllowance();
    loadPeriodFinish();
  });

  return (
    <PoolComposition image1={Config.Token.image} image2={Config.WethToken.image} />
  )
};

function mapStateToProps(
  state: RootState,
): StateFromProps {
  return {
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    loadAllowance: () => dispatch(poolLoadAllowance()),
    loadPeriodFinish: () => dispatch(poolGetPeriodFinish()),
    setPoolInfo: (payload: any) => dispatch(poolSetPoolInfo(payload)),
    setStakeTokenInfo: (payload: any) => dispatch(poolSetStakeTokenInfo(payload)),
    setPoolContract: (payload: any) => dispatch(poolSetContract(payload)),
    setStakeTokneContract: (payload: any) => dispatch(poolSetStakeTokenContract(payload)),
    setRewardTokenInfo: (payload: any) => dispatch(poolSetRewardTokenInfo(payload)),
    setRewardTokenContract: (payload: any) => dispatch(poolSetRewardTokenContract(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pool2Composition);
