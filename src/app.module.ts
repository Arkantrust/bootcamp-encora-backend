import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { SeederModule } from './seed/seed.module';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_PASS}@${process.env.MAIL_HOST}`,
      defaults: {
        from: `Fitnest Corp" <${process.env.MAIL_USER}>`,
      }
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME, 
      username: process.env.DB_USER, 
      password: process.env.DB_PASSWORD, 
      autoLoadEntities: true, 
      synchronize: true ,
      ssl: {
        ca: fs.readFileSync('us-east-1-bundle.pem')
      } 
    }),
    AuthModule, 
    CommonModule,
    OrdersModule, 
    ShoppingCartModule, 
    SeederModule,
    ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
