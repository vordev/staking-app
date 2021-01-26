import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Card, CardContent } from '@material-ui/core';

interface OwnProps {
  stakingToken: any;
  image1: string;
  image2: string;
  poolUrl: string;
  apy: number;
  isActive: boolean;
}

type Props = OwnProps & RouteComponentProps;

const PoolCard: React.FC<Props> = ({ stakingToken, image1, image2, poolUrl, apy, history, isActive }: Props) => {
  return (
    <Card className={`card card-h medium transparent`}>
      <CardContent>
        <div className='section'>
          <div className='center-h mb-10'>
            <div className='mr-20'>
              <img className="logo-image" src={image1} alt='icon1' />
            </div>
            <div>
              <img className="logo-image" src={image2} alt='icon2' />
            </div>
          </div>
          <div className='center-h'>
            <h2 className='mt-10 mb-10'>{stakingToken.name}</h2>
          </div>
          <div className='center-h'>
            <span className='text-small'>{`Deposit ${stakingToken.symbol}`}</span>
          </div>
          <div className='center-h mb-20'>
            <span className='text-small'>{`Earn MCP`}</span>
          </div>
          <div className='center-h'>
            {apy ? (
              <span className='text-small text-gray'>{`${apy.toFixed(2)}% APY`}</span>
            ) : (
              <span className='text-small text-gray'>Loading...</span>
            )}
          </div>
        </div>
        <div className='section'>
          <div className='mt-20' />
          <div className='center-h'>
            <Button variant='contained' className='btn-primary' onClick={() => history.push(poolUrl)} disabled={!isActive}>
              {isActive ? 'Select' : 'Coming Soon'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
};

export default withRouter(PoolCard);
