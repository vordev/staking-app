import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Config from 'config';
import { Button } from '@material-ui/core';

import { Container, Header, Footer, ParticlesContainer } from 'components';
import { RootState } from 'types';
import { selectAccount } from 'store/account/accountSelector';
import PoolCard from './PoolCard';
import lockImage from 'assets/img/lock.png';
import walletImage from 'assets/img/wallet.png';

import { dexclient, web3client } from 'lib';
import { formatPrice, numberWithDecimals } from 'utils';

interface StateFromProps {
  account: ReturnType<typeof selectAccount>;
}
interface DispatchFromProps {}
interface OwnProps {}

type Props = StateFromProps & DispatchFromProps & OwnProps;

const FarmComposition = ({ account }: Props) => {
  const [tokenPrice, setTokenPrice] = React.useState<number>(0);
  const [pool1APY, setPool1APY] = React.useState<number>(0);
  //const [pool2APY, setPool2APY] = React.useState<number>(0);
  const [pool1TVL, setPool1TVL] = React.useState<number>(0);
  //const [pool2TVL, setPool2TVL] = React.useState<number>(0);
  useEffect(() => {
    dexclient.getTokenPrice().then(res => setTokenPrice(res));
  });
  useEffect(() => {
    if (tokenPrice > 0) {
      dexclient.getWethLpTokenPrice().then(price => {
        web3client.poolGetRewardRate(web3client.pool1Contract).then(res => {
          const roi = res * tokenPrice / Math.pow(10, 18) / price * 86400 * 365 * 100;
          setPool1APY(roi);
        });
        web3client.getTotalSupply(web3client.pool1Contract).then(amount => {
          setPool1TVL(price * amount / Math.pow(10, Config.WethLpToken.decimals));
        });
      });

      /*coingeckoclient.getUniPrice().then(price => {
        web3client.poolGetRewardRate(web3client.pool2Contract).then(res => {
          const roi = res * tokenPrice / Math.pow(10, 18) / price * 86400 * 365 * 100;
          setPool2APY(roi);
        });
        web3client.getTotalSupply(web3client.pool2Contract).then(amount => {
          setPool2TVL(price * amount / Math.pow(10, Config.NerdzLpToken.decimals));
        });
      })*/
    }
  }, [tokenPrice]);

  //const totalValueLocked = () => pool1TVL + pool2TVL;

  return (
    <ParticlesContainer>
      <Header />
      <Container>
        <div className='flex-v'>
          <div className='center-h mt-30'>
            <Button variant='contained' className='btn-announce'>
              Read The Announcement
            </Button>
          </div>
          <div className='text-gray text-tiny text-center mt-10'>
            This project is in beta. Use at your own risk.
          </div>
          <div className='center-h mt-50 mb-100'>
            <div className='card card-info mr-50'>
              <img src={walletImage} width={70} alt='MCP' />
              <div className='ml-20 mr-10'>
                <div className='text-normal text-gray'>Your Available MCP Balance</div>
                <div className='text-medium text-green mt-10'>{numberWithDecimals(account ? account.balance : 0, Config.Token.decimals, 3)}</div>
              </div>
            </div>
            <div className='card card-info'>
              <img src={lockImage} width={70} alt='MCP' />
              <div className='ml-20 mr-10'>
                <div className='text-normal text-gray'>MCP Total Value Locked</div>
                <div className='text-medium text-green mt-10'>{formatPrice(pool1TVL, 3)}</div>
              </div>
            </div>
          </div>
          <div className='center-h text-medium mb-10'>
            <span>SELECT YOUR POOL</span>
          </div>
          <div className='center-h text-small'>
            <span>Earn $MCP tokens by staking UNI-V2 LP token</span>
          </div>
          <div className='center-h wp-100 mt-30 home-container'>
            <PoolCard
              stakingToken={Config.WethLpToken}
              image1={Config.Token.image}
              image2={Config.WethToken.image}
              poolUrl='/farm-wethlp'
              apy={pool1APY}
              tvl={pool1TVL}
              isActive={true}
            />
            <PoolCard
              stakingToken={Config.NerdzLpToken}
              image1={Config.Token.image}
              image2={Config.NerdzToken.image}
              poolUrl='/farm-nerdzlp'
              apy={0}
              tvl={0}
              isActive={false}
            />
          </div>
        </div>
        <div className='mb-100' />
      </Container>
      <Footer />
    </ParticlesContainer>
  )
}

function mapStateToProps(
  state: RootState,
): StateFromProps {
  return {
    account: selectAccount(state),
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FarmComposition)
