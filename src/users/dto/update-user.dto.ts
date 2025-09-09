import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// وراثة من CreateUserDto لأن جميع الحقول اختيارية في التحديث وما يحتاج نكرر الكود ونخليه كله اختياري
