import React from 'react';
import { withWidth, Hidden, Button } from '@material-ui/core';

const HideBar = () => {
  return (
    <div>
        <Hidden smDown>
            <Button>
                Boton
            </Button>
        </Hidden>
    </div>
  )
}

export default HideBar