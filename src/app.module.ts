import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
