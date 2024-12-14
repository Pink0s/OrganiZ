import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, Req, Res } from "@nestjs/common";
import { StatusesService } from '../services/statuses.service';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateStatusDTO } from '../dto/createStatusDTO';
import { UpdateStatusDTO } from "../dto/updateStatusDTO";

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

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all status' })
  @HttpCode(HttpStatus.OK)
  async getAllStatus(@Req() request: Request) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get one status' })
  @HttpCode(HttpStatus.OK)
  async getOneStatus(@Req() request: Request, @Param('id') id: number) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update a status' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.update(id, updateStatusDTO.name);
  }
}
