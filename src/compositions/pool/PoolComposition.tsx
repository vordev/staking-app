import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from 'types';

import { Container, Header, Footer, ConnectWalletButton, RewardAsset, StakeAsset, ParticlesContainer } from 'components';
import {
  poolStake,
  poolWithdraw,
  poolApproveToken,
  poolHarvest,
  poolExit,
  poolGetStaked,
  poolGetEarned,
} from 'store/pool/poolActions';
import {
  selectPoolStaked,
  selectPoolEarned,
  selectPoolStakeAllowed,
  selectStakeTokenBalance,
  selectPoolTotalStaked,
  selectPoolPeriodFinish,
  selectPoolStakeTokenInfo,
  selectPoolInfo,
  selectPoolRewardTokenInfo
} from 'store/pool/poolSelector';
import { selectAccount } from 'store/account/accountSelector';
import { getDateLeft, numberWithDecimals, formatPrice } from 'utils';
import logoImage from 'assets/img/logo.png';
import { dexclient, web3client } from 'lib';

interface StateFromProps {
  account: ReturnType<typeof selectAccount>;
  staked: ReturnType<typeof selectPoolStaked>;
  earned: ReturnType<typeof selectPoolEarned>;
  allowed: ReturnType<typeof selectPoolStakeAllowed>;
  totalStaked: ReturnType<typeof selectPoolTotalStaked>
  stakeTokenBalance: ReturnType<typeof selectStakeTokenBalance>;
  deadline: ReturnType<typeof selectPoolPeriodFinish>;
  stakeTokenInfo: ReturnType<typeof selectPoolStakeTokenInfo>;
  rewardTokenInfo: ReturnType<typeof selectPoolRewardTokenInfo>;
  poolInfo: ReturnType<typeof selectPoolInfo>;
}
interface DispatchFromProps {
  stake: typeof poolStake;
  unstake: typeof poolWithdraw;
  approve: typeof poolApproveToken;
  harvest: typeof poolHarvest;
  exit: typeof poolExit;
  loadStaked: typeof poolGetStaked;
  loadEarned: typeof poolGetEarned;
}
interface OwnProps {
  image1: string;
  image2: string;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

const PoolComposition: React.FC<Props> = ({
  account,
  allowed,
  staked,
  totalStaked,
  stakeTokenBalance,
  deadline,
  approve,
  stake,
  unstake,
  earned,
  harvest,
  exit,
  loadEarned,
  loadStaked,
  stakeTokenInfo,
  rewardTokenInfo,
  poolInfo,
  image1,
  image2
}) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [tokenPrice, setTokenPrice] = React.useState<number>(0);
  const [tokenPerLpRate, setTokenPerLpRate] = React.useState<number>(0);
  const [wethPerLpRate, setWethPerLpRate] = React.useState<number>(0);
  const [rewardPerBlock, setRewardPerBlock] = React.useState<number>(0);
  const [apy, setApy] = React.useState<number>(0);

  useEffect(() => {
    dexclient.getTokenPrice().then(res => setTokenPrice(res));
    dexclient.getTokenPerLpToken().then(res => setTokenPerLpRate(res));
    dexclient.getWethPerLpToken().then(res => setWethPerLpRate(res));
    web3client.pool1Contract.methods.rewardRate().call().then((res: number) => setRewardPerBlock(res * 15 / Math.pow(10, 18)));
  });
  useEffect(() => setTimeLeft(getDateLeft(deadline)), [deadline]);
  useEffect(() => {
    const timeInterval = setInterval(() => setTimeLeft(getDateLeft(deadline)), 1000);
    return () => clearInterval(timeInterval);
  });
  useEffect(() => {
    loadEarned(); loadStaked();
    const timeInterval = setInterval(() => { loadEarned(); loadStaked(); }, 60000);
    return () => clearInterval(timeInterval);
  });
  useEffect(() => {
    if (tokenPrice > 0) {
      dexclient.getWethLpTokenPrice().then(price => {
        web3client.poolGetRewardRate(web3client.pool1Contract).then(res => {
          const roi = res * tokenPrice / Math.pow(10, 18) / price * 86400 * 365 * 100;
          setApy(roi);
        });
      });
    }
  }, [tokenPrice]);


  if (!account) {
    return (
      <ParticlesContainer>
        <Header />
        <Container>
          <div className='screen-center flex-v'>
            <ConnectWalletButton />
          </div>
        </Container>
        <Footer />
      </ParticlesContainer>
    )
  }

  if (!stakeTokenInfo) return <></>;

  return (
    <ParticlesContainer>
      <Header />
      <Container>
        <div className='flex-v screen-csenter'>
          <div className='center-h mt-50 mb-10' style={{ zIndex: 1 }}>
            <div className='mr-30'>
              <img src={image1} width={70} alt='icon1' />
            </div>
            <div>
              <img src={image2} width={70} alt='icon2' />
            </div>
          </div>
          <div className='mb-20' style={{ zIndex: 1 }}>
            <div className='center-h text-title mb-10'>
              <span>{stakeTokenInfo.name}</span>
            </div>
            <div className={`center-h text-small text-gray`}>
              <span>{`Deposit ${stakeTokenInfo.symbol} and earn ${rewardTokenInfo.symbol}`}</span>
            </div>
            <div className='center-h'>

              <div className='flex-h'>
                <a target='__blank' href='https://app.uniswap.org/#/add/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca/ETH' style={{ color: 'rgb(246, 185, 68)' }}>
                  Add Liquidity on Uniswap
                </a>
                <div className='mr-20' />
                <a target='__blank' href='https://app.uniswap.org/#/remove/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca/ETH' style={{ color: 'rgb(246, 185, 68)' }}>
                  Remove Liquidity on Uniswap
                </a>
              </div>
            </div>
          </div>
          <div className='center-h mt-50'>
            <div className='card card-info' style={{ width: 640 }}>
              <div className='flex-h'>
                <div className='mr-100'>
                  <div className='text-small text-green mb-20'>APY</div>
                  <div className='text-small'>{apy.toFixed(2)}%</div>
                </div>
                <div className='mr-100'>
                  <div className='text-small text-green mb-20'>Total Staked LP Token</div>
                  <div className='text-small mb-10'>
                    {numberWithDecimals(totalStaked * tokenPerLpRate, 18, 3)} MCP  +  {numberWithDecimals(totalStaked * wethPerLpRate, 18, 3)} WETH
                  </div>
                  <div className='text-small text-gray'>{numberWithDecimals(totalStaked, 18, 3)} MCP-WETH LP</div>
                </div>
                <div>
                  <div className='text-small text-green mb-20'>Average Reward per block</div>
                  <div className='text-small mb-10'>{numberWithDecimals(rewardPerBlock, 18, 3)} MCP</div>
                  <div className='text-small text-gray'>= {formatPrice(tokenPrice * rewardPerBlock, 2)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='center-h mt-50'>
            <div className='text-medium text-gray'>YOUR STAKING</div>
          </div>
          <div className='center-h wp-100 mt-30 home-container'>
            <RewardAsset
              rewardToken={rewardTokenInfo}
              earned={0}
              started={timeLeft > 0}
              percent={1}
              onHarvest={harvest}
            />
            <StakeAsset
              stakeTokenInfo={stakeTokenInfo}
              rewardTokenInfo={rewardTokenInfo}
              allowed={allowed}
              started={timeLeft > 0}
              staked={staked}
              totalStaked={totalStaked}
              balance={stakeTokenBalance}
              rewardBalance={poolInfo.balance}
              onApprove={approve}
              onStake={(amount: number) => stake(amount)}
              onUnstake={unstake}
            />
          </div>
          <div className='mt-50 mb-100' style={{ paddingLeft: 250, paddingRight: 250, zIndex: 1 }}>
            <div className='text-small text-orange text-center center-h mt-20'>
              <span role='img' aria-label='pointer'>👉</span> Every time you stake and unstake LP tokens, the contract will automatically harvest MCP rewards for you!
            </div>
            <div className='text-small text-orange text-center center-h mt-10'>
              <span role='img' aria-label='pointer'>👉</span> Liquidity Token is locked and withdrawals will be available 15 days after depositing to the pool!
            </div>
            <div className='text-small text-orange text-center center-h mt-10'>
              <span role='img' aria-label='pointer'>👉</span> 50% of your MCP rewards will be unlocked immediately when harvesting. The remaining 50% will be unlocked within the next 15 days!
            </div>
          </div>
          <div className='center-h mb-50'>
            <div style={{ paddingLeft: 250, paddingRight: 250, zIndex: 1 }}>
              <div className='text-small mb-10'>MAYBE YOU DON'T KNOW</div>
              <div className='card card-tip'>
                <img src={logoImage} width={70} alt='MCP' />
                <div className='ml-20'>
                  <div className='text-small mb-10'>
                    Add/Remove liquidity to <span className='text-orange'>MCP-ETH pair</span> on UniSwap to get <span className='text-orange'>MCP-ETH UNI-V2</span> tokens. Then deposit those LP tokens to receive rewards
                  </div>
                  <div className='flex-h'>
                    <a target='__blank' href='https://app.uniswap.org/#/add/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca/ETH' style={{ color: 'rgb(246, 185, 68)' }}>
                      Add Liquidity on Uniswap
                    </a>
                    <div className='mr-20' />
                    <a target='__blank' href='https://app.uniswap.org/#/remove/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca/ETH' style={{ color: 'rgb(246, 185, 68)' }}>
                      Remove Liquidity on Uniswap
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </ParticlesContainer>
  )
};

function mapStateToProps(
  state: RootState,
): StateFromProps {
  return {
    account: selectAccount(state),
    totalStaked: selectPoolTotalStaked(state),
    staked: selectPoolStaked(state),
    allowed: selectPoolStakeAllowed(state),
    earned: selectPoolEarned(state),
    stakeTokenBalance: selectStakeTokenBalance(state),
    deadline: selectPoolPeriodFinish(state),
    stakeTokenInfo: selectPoolStakeTokenInfo(state),
    rewardTokenInfo: selectPoolRewardTokenInfo(state),
    poolInfo: selectPoolInfo(state),
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    stake: (payload: number) => dispatch(poolStake(payload)),
    unstake: (payload: number) => dispatch(poolWithdraw(payload)),
    approve: () => dispatch(poolApproveToken()),
    harvest: () => dispatch(poolHarvest()),
    exit: () => dispatch(poolExit()),
    loadEarned: () => dispatch(poolGetEarned()),
    loadStaked: () => dispatch(poolGetStaked()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PoolComposition);
