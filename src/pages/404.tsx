import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  Box, Button, Typography, Container,
} from '@mui/material';

import { MotionContainer, varBounceIn } from 'src/components/animate';
import Page from 'src/components/Page';

const RootStyle = styled(Page)`
  display: flex;
  min-height: 100%;
  align-items: center;
  padding: 5%;
`;

const PageNotFound = () => (
  <Page title="404 Page Not Found | SG Delivery">
    <Container>
      <MotionContainer initial="initial" open>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <motion.div variants={varBounceIn}>
            <Typography variant="h3" paragraph>
              Sorry, page not found!
            </Typography>
          </motion.div>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
            Be sure to check your spelling.
          </Typography>

          <motion.div variants={varBounceIn}>
            <Box
              component="img"
              src="/static/illustrations/illustration_404.svg"
              sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
            />
          </motion.div>

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home Page
          </Button>
        </Box>
      </MotionContainer>
    </Container>
  </Page>
);

export default PageNotFound;
