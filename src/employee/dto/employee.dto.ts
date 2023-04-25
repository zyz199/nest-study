import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMobilePhone, Length } from 'class-validator';

// 重置密码
export class ResetPasswordDto {
  @ApiProperty({
    description: '旧密码',
  })
  oldPassword: string;

  @ApiProperty({
    description: '新密码',
  })
  @Length(6)
  newPassword: string;
}

// 找回密码
export class RetrievePasswordDto {
  @ApiProperty({
    description: '手机号',
  })
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    description: '图形验证码',
  })
  @Length(4)
  code: string;

  @ApiProperty({
    description: '短信验证码',
  })
  @Length(4)
  SMSCode: string;

  @ApiProperty({
    description: '新密码',
  })
  @Length(6)
  newPassword: string;
}

export class SendSMSDto {
  @ApiProperty({
    description: '手机号',
  })
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    description: '验证码',
  })
  @Length(4)
  code: string;
}
