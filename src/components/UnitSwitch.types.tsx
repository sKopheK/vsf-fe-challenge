import { ChangeEvent } from 'react';

export interface UnitSwitchProps {
  checked?: boolean;
  handleOnChange?: (event: ChangeEvent, checked: boolean) => void;
}
