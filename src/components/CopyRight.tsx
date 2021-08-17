import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const CopyRight = ({ websiteName, url }: { websiteName: string, url: string }) => (
  <Typography variant="body2" color="textSecondary" align="center">
    { 'Copyright © ' }
    <Link color="inherit" href={url}>
      {websiteName}
    </Link>
    {' '}
    { new Date().getFullYear() }
    .
  </Typography>
);

export default CopyRight;
