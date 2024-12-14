import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { StatusesService } from '../services/statuses.service';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateStatusDTO } from '../dto/createStatusDTO';

@Controller('statuses')
export class StatusesController {
  private readonly logger = new Logger(StatusesController.name);
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create a status' })
  @HttpCode(HttpStatus.CREATED)
  async createStatus(
    @Req() request: Request,
    @Body() createStatusDTO: CreateStatusDTO,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.createStatus(createStatusDTO.name);
  }
}
