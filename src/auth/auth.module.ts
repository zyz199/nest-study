import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployeeModule } from '../employee/employee.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getConfig } from 'src/common/utils/ymlConfig';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Global()
@Module({
  imports: [
    EmployeeModule,
    PassportModule,
    JwtModule.register({ ...getConfig('JWT') }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
