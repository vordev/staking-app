import React from 'react';
import { Container } from 'components';
import Logo from 'assets/img/logo.png';
import { Button } from '@material-ui/core';

const Footer: React.FC = () => {
  return (
    <div className='footer'>
      <Container>
        <div className='footer-container'>
          <div className="center-v">
            <img className='nav-header__logo' src={Logo} width='70' alt='DOT' />
          </div>
          <div className="flex-h">
            <Button className='btn-text' href='https://etherscan.io/address/0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca' >MCP CONTRACT</Button>
            <Button className='btn-text' href='https://app.uniswap.org/#/swap?inputCurrency=0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca' >UNISWAP</Button>
            <Button className='btn-text' href='https://t.me/mycryptoplaychat' >TELEGRAM</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Footer;
