import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, IconButton } from '@material-ui/core';
import { Container } from 'components';
import { selectAccount } from 'store/account/accountSelector';
import { RootState } from 'types';
import { truncateAddress } from 'utils';
import Config from 'config';
import Logo from 'assets/img/logo.png';
import { loadAccount } from 'store/account/accountActions';

interface StateFromProps {
  account: ReturnType<typeof selectAccount>;
}
interface DispatchFromProps {
  loadAccount: typeof loadAccount;
}
type Props = StateFromProps & DispatchFromProps & RouteComponentProps;

const Header: React.FC<Props> = ({ account, history, loadAccount }: Props) => {
  return (
    <div className='header'>
      <Container>
        <div className="nav-header" style={{ zIndex: 1 }}>
          <IconButton className='nav-header__logo' onClick={() => history.push('/')}>
            <img src={Logo} width='70' alt='DOT' />
          </IconButton>
          <div className="flex-h">
            <Button className='btn-text text-white mr-120' href='https://mycryptoplay.com/' >Home</Button>
            <Button className='btn-text text-white' href='https://etherscan.io/address/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca' >MCP Contract</Button>
            <Button className='btn-text text-white' href='https://app.uniswap.org/#/swap?inputCurrency=0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca' >Uniswap</Button>
            <Button className='btn-text text-white' href='https://twitter.com/mycryptoplay' >Twitter</Button>
            <Button className='btn-text text-white' href='https://t.me/mycryptoplaychat' >Telegram</Button>
          </div>
          {account ? (
            <Button
              variant='contained'
              className='btn-header'
              href={`${Config.etherscan}${account.address}`}
              target='_blank'
            >{truncateAddress(account.address)}</Button>
          ) : (
            <Button onClick={loadAccount} className='btn-header' >
              Unlock Wallet
            </Button>
          )}
        </div>
      </Container>
    </div>
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
  return {
    loadAccount: () => dispatch(loadAccount()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Header));
