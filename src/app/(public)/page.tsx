import React from 'react';
import { HomeClientView } from '@/components/home/HomeClientView';
import { productService } from '@/server/services/product-service';

export default async function HomePage() {
  const { items } = await productService.listProducts({ limit: 8 });

  return <HomeClientView products={items} />;
}

