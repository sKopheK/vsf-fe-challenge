import { FormControlLabel, FormGroup } from '@mui/material';
import Switch from '@mui/material/Switch';
import { ChangeEvent, FC, useCallback, useContext } from 'react';
import {
  UNIT_CELSIUS,
  UNIT_CELSIUS_LABEL,
  UNIT_FARENHEIT,
  UNIT_FARENHEIT_LABEL,
} from './App.constants';
import { AppContext } from './App.context';
import { UnitSwitchProps } from './UnitSwitch.types';

const UnitSwitch: FC<UnitSwitchProps> = (props) => {
  const appContext = useContext(AppContext);
  const handleOnChange = useCallback((_: ChangeEvent, checked: boolean) => {
    appContext.setUnit(checked ? UNIT_CELSIUS : UNIT_FARENHEIT);
  }, []);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <FormControlLabel
            control={
              <Switch
                onChange={handleOnChange}
                checked={appContext.unit === UNIT_CELSIUS}
                sx={{ marginLeft: '10px' }}
              />
            }
            label={UNIT_CELSIUS_LABEL}
          />
        }
        label={UNIT_FARENHEIT_LABEL}
        labelPlacement="start"
      />
    </FormGroup>
  );
};

export default UnitSwitch;
