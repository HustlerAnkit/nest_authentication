import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LoginDTO, RegisterDTO } from './dto';
import { User } from 'src/entities';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userModel: Repository<User>){}

    async register(register: RegisterDTO){
        const unique = await this.userModel.findOne({ where: [{ username: register.username }, { email: register.email }]});

        if(unique){
            if(unique.username === register.username) {
                throw new BadRequestException('username is already taken');
            }else if(unique.email === register.email){
                throw new BadRequestException('email is already taken');
            }
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(register.password, genSalt);
        register.password = hashedPass;
        const newUser = this.userModel.create({
            ...register,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await this.userModel.save(newUser);
    }

    login(credential: LoginDTO){
        
    }

    logout(){

    }
}
