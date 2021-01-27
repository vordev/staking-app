import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button } from '@material-ui/core';
import { numberWithDecimals } from 'utils';
import Config from 'config';

interface OwnProps {
  open: boolean;
  dialogTitle: React.ReactElement;
  stakeToken: any;
  totalStaked: number;
  userBalance: number;
  staked: number;
  onClose: () => void;
  onUnstake: (amount: number) => void;
}

type Props = OwnProps;

const UnstakeDialog: React.FC<Props> = ({
  open,
  dialogTitle,
  staked,
  stakeToken,
  totalStaked,
  userBalance,
  onClose,
  onUnstake,
}: Props) => {
  const [unstakeAmount, setUnstakeAmount] = React.useState<string>('');

  const handleUnstake = () => {
    const _amount = parseFloat(unstakeAmount);
    const _balance = numberWithDecimals(staked, stakeToken.decimals, Config.Utils.decimals);
    if (_amount > _balance || _amount <= 0) {
      alert('Invalid withdraw amount');
    } else {
      onUnstake(_amount);
      onClose();
    }
  }

  const handleSetMax = () => {
    const _balance = numberWithDecimals(staked, stakeToken.decimals, Config.Utils.decimals, true);
    setUnstakeAmount(_balance.toString());
  }

  return (
    <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <div className='space-between'>
            <span className='text-small text-black'>
              Your Staked {stakeToken.symbol} Balance
            </span>
            <div className='flex-h'>
              <b className='text-small text-black'>{numberWithDecimals(staked, stakeToken.decimals, Config.Utils.decimals)}</b>
              <Button className='btn-stake__max' onClick={handleSetMax}>Max</Button>
            </div>
          </div>
          <TextField
            className='staking-input mt-50'
            variant='outlined'
            placeholder='Enter amount to withdraw'
            onChange={(event) => setUnstakeAmount(event.target.value)}
            value={unstakeAmount}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button className='btn-modal' onClick={handleUnstake} >
            Withdraw
          </Button>
          <Button className='btn-modal' onClick={onClose} >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  )
};

export default UnstakeDialog;
