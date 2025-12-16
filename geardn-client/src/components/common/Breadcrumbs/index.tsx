import AppLink from '../AppLink';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as BaseBreadcrumbs, Typography } from '@mui/material';

interface IBreadcrumbsProps {
  options: IBreadcrumbOption[];
}

export interface IBreadcrumbOption {
  href: string;
  label: string;
}

const Breadcrumbs = ({ options }: IBreadcrumbsProps) => {
  return (
    <BaseBreadcrumbs
      separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
      aria-label='breadcrumb'
      sx={{
        '.MuiBreadcrumbs-ol': {
          width: '100%',
          flexWrap: { xs: 'nowrap', lg: 'nowrap' },
        },
        '.MuiBreadcrumbs-li': {
          display: 'inline-block',
          lineHeight: '12px',
          ':last-child': {
            overflow: { xs: 'hidden', lg: 'hidden' },
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'nowrap', lg: 'nowrap' },
          },
        },
      }}>
      {options?.map((item, index) => {
        return (
          <AppLink component={'span'} key={index} href={item.href}>
            <Typography
              sx={{
                fontSize: { xs: 13, lg: 16 },
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
              {item.label}
            </Typography>
          </AppLink>
        );
      })}
    </BaseBreadcrumbs>
  );
};

export default Breadcrumbs;
