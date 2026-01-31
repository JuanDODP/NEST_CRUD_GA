import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) { }

  @Post()
  @Auth()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }
              
  @Get()
  findAll() {
    return this.areasService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
