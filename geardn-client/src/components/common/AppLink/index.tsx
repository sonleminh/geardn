import React from 'react';
import Link, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

type AppLinkProps = NextLinkProps & MuiLinkProps & { href: string };

const AppLink = ({ ...props }: AppLinkProps) => {
  return (
    <MuiLink
      {...props}
      component={Link}
      href={props.href}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        ...props.sx,
      }}
    />
  );
};

export default AppLink;
