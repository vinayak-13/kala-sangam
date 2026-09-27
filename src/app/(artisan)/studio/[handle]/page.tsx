import React from 'react';
import { ArtisanProfileView } from '@/components/profile/ArtisanProfileView';
import { productService } from '@/server/services/product-service';

interface ProfilePageProps {
  params: Promise<{ handle: string }>;
}

export default async function ArtisanInstagramProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const { items } = await productService.listProducts({ limit: 12 });

  return <ArtisanProfileView handle={handle} initialProducts={items as any} />;
}
