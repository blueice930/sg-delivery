import { Helmet } from 'react-helmet';
import React, { forwardRef, ReactNode } from 'react';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Page = forwardRef(({ title = '', children, ...other }:
{ title: string, children: ReactNode, [other:string]: any }, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </Box>
));

export default Page;
