import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { ProductSkuModule } from '../product-sku/product-sku.module';
import { AppCacheModule } from '../cache/cache.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, CategoryModule, ProductSkuModule, AppCacheModule],
})
export class ProductModule {}
