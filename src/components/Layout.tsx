import { Card, CardContent, CardHeader, Container } from '@mui/material';
import { filter } from 'lodash';
import moment from 'moment';
import { FC, useContext } from 'react';
import {
  APP_TITLE,
  UNIT_CELSIUS,
  UNIT_CELSIUS_LABEL,
  UNIT_FARENHEIT_LABEL,
} from './App.constants';
import { AppContext } from './App.context';
import { TEMPERATURE_DECIMALS, TIME_FORMAT } from './Layout.constants';

import UnitSwitch from './UnitSwitch';

import AirIcon from '@mui/icons-material/Air';
import DarkMode from '@mui/icons-material/DarkMode';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import Grid from '@mui/material/Unstable_Grid2';

import styles from './Layout.module.scss';

const Layout: FC = () => {
  const data = useContext(AppContext);
  return (
    <Container className={styles.wrapper} maxWidth="sm">
      <Card variant="outlined">
        <CardHeader
          title={
            <div className={styles.title}>
              <div className={styles.header}>
                <h1 className={styles.heading}>{APP_TITLE}</h1>
                <span className={styles.location}>
                  {filter([
                    data.city ?? '',
                    data.region ?? '',
                    data.country ?? '',
                  ]).join(', ')}
                </span>
              </div>
              <UnitSwitch />
            </div>
          }
        />{' '}
        <CardContent>
          <Grid container spacing={2.5}>
            <Grid container xs={12} className={styles.main}>
              <Grid xs={6} className={styles.category}>
                <ThermostatIcon color="primary" />
                {`${data.temperature?.toFixed(TEMPERATURE_DECIMALS)} ${
                  data.unit === UNIT_CELSIUS
                    ? UNIT_CELSIUS_LABEL
                    : UNIT_FARENHEIT_LABEL
                }`}
              </Grid>
              <Grid xs={6} className={styles.weatherType}>
                {data.main}
              </Grid>
            </Grid>

            <Grid xs={9} className={styles.category}>
              <InvertColorsIcon color="primary" />
              Humidity
            </Grid>
            <Grid xs={3} className={styles.value}>
              {`${data.humidity} %`}
            </Grid>

            <Grid xs={9} className={styles.category}>
              <AirIcon color="primary" />
              Wind
            </Grid>
            <Grid xs={3} className={styles.value}>
              {`${data.windSpeed} m/s`}
            </Grid>

            <Grid xs={9} className={styles.category}>
              <WbTwilightIcon color="primary" />
              Sunrise
            </Grid>
            <Grid xs={3} className={styles.value}>
              {moment(data.sunrise).format(TIME_FORMAT)}
            </Grid>

            <Grid xs={9} className={styles.category}>
              <DarkMode color="primary" />
              Sunset
            </Grid>
            <Grid xs={3} className={styles.value}>
              {moment(data.sunset).format(TIME_FORMAT)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Layout;
