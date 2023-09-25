import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Publc = (passThrough: boolean = true) => SetMetadata(IS_PUBLIC_KEY, passThrough);
