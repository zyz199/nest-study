import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getConfig } from '../../common/utils/ymlConfig';
import { Employee } from '../../employee/entities/employee.entity';
import { TIdAndUsername } from '../../types/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 提供从请求中提取 JWT 的方法。我们将使用在 API 请求的授权头中提供token的标准方法
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   false 将JWT没有过期的责任委托给Passport模块
      ignoreExpiration: false,
      //   密钥
      secretOrKey: getConfig('JWT')['secret'],
    });
  }

  //  jwt验证
  async validate(
    payload: Pick<Employee, TIdAndUsername> & { iat: number; exp: number },
  ) {
    if (!process.env.id) {
      process.env.id = payload.id;
    }
    return {
      id: payload.id,
      username: payload.username,
    };
  }
}
