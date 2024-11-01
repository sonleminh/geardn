import LayoutContainer from '@/components/common/sharing/layout-container';
import UserLayout from '@/components/common/sharing/user-layout';
import { ReactNode } from 'react';

export default function PurchaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Đơn hàng', href: '/don-hang' },
  ];

  return <UserLayout breadcrumbs={breadcrumbs}>{children}</UserLayout>;
}
