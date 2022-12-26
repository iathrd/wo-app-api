import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'iqbal',
      password: 'iqbal123',
      database: 'wo-app',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
