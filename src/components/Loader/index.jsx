import { CircularProgress, Grid, Typography } from '@mui/material';
import classnames from 'classnames';
import React from 'react';
import './index.sass';

const Loader = (props) => {
   const { overlay } = props;

   return (
      <Grid
         className={classnames({
            wrapper: true,
            overlay: !!overlay,
         })}
      >
         <Grid item xs={12}>
            <CircularProgress data-testid="loader" />
         </Grid>
         <Grid item xs={12}>
            <Typography>Loading...</Typography>
         </Grid>
      </Grid>
   );
};

export default Loader;
