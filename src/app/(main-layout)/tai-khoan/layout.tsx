import LayoutContainer from '@/components/common/sharing/layout-container';
import UserLayout from '@/components/common/sharing/user-layout';
import { ReactNode } from 'react';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tài Khoản', href: '/tai-khoan' },
  ];

  return <UserLayout breadcrumbs={breadcrumbs}>{children}</UserLayout>;
}
