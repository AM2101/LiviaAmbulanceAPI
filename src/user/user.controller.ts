import { Body, Controller, HttpCode, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonService } from 'src/common/common.service';
import { USER_MODEL, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ADD_USER_OUTPUT_ADMIN, ADD_USER_OUTPUT_INSURER } from 'src/constants/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { StatusGuard } from 'src/guards/status.guard';
import { WriteAccessGuard } from 'src/guards/write-access.guard';
import { AddUserDto } from './dto/user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly commonService: CommonService,
        @InjectModel(USER_MODEL)
        private userModel: Model<UserDocument>,
    ) { }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Successful Response',
        content: {
            'application/json': {
                examples: {
                    ADD_USER_OUTPUT_ADMIN: { value: ADD_USER_OUTPUT_ADMIN },
                    ADD_USER_OUTPUT_INSURER: { value: ADD_USER_OUTPUT_INSURER },
                },
            },
        },
    })
    @UseGuards(AuthGuard)
    @UseGuards(StatusGuard)
    @UseGuards(WriteAccessGuard)
    @UsePipes(ValidationPipe)
    @Post('addUser')
    @HttpCode(200)
    async addUser(@Body() addUserDto: AddUserDto, @Request() req) {
        return await this.userService.addUser(addUserDto, req);
    }
}
