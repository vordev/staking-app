import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button } from '@material-ui/core';
import { numberWithDecimals } from 'utils';
import Config from 'config';

interface OwnProps {
  open: boolean;
  dialogTitle: React.ReactElement;
  stakeToken: any;
  userBalance: number;
  onClose: () => void;
  onStake: (amount: number) => void;
}

type Props = OwnProps;

const StakeDialog: React.FC<Props> = ({
  open,
  dialogTitle,
  stakeToken,
  userBalance,
  onClose,
  onStake,
}: Props) => {
  const [stakeAmount, setStakeAmount] = React.useState<string>('');

  const handleStake = () => {
    const _amount = parseFloat(stakeAmount);
    const _balance = numberWithDecimals(userBalance, stakeToken.decimals, Config.Utils.decimals, true);
    if (_amount > _balance || _amount <= 0) {
      alert('Invalid stake amount');
    } else {
      onStake(_amount);
      onClose();
    }
  }

  const handleSetMax = () => {
    const _balance = numberWithDecimals(userBalance, stakeToken.decimals, Config.Utils.decimals, true);
    setStakeAmount(_balance.toString());
  }

  return (
    <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <div className='space-between'>
            <span className='text-small text-black'>
              {stakeToken.symbol} Balance
            </span>
            <div className='flex-h'>
              <b className='text-small text-black'>{numberWithDecimals(userBalance, stakeToken.decimals, Config.Utils.decimals)}</b>
              <Button className='btn-stake__max' onClick={handleSetMax}>Max</Button>
            </div>
          </div>
          <TextField
            className='staking-input mt-50'
            variant='outlined'
            placeholder='Enter amount to stake'
            onChange={(event) => setStakeAmount(event.target.value)}
            value={stakeAmount}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button className='btn-modal' onClick={handleStake} >
            Stake
          </Button>
          <Button className='btn-modal' onClick={onClose} >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  )
};

export default StakeDialog;
