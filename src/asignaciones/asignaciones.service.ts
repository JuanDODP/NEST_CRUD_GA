import { Injectable } from '@nestjs/common';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';

@Injectable()
export class AsignacionesService {
  create(createAsignacioneDto: CreateAsignacioneDto) {
    return 'This action adds a new asignacione';
  }

  findAll() {
    return `This action returns all asignaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacione`;
  }

  update(id: number, updateAsignacioneDto: UpdateAsignacioneDto) {
    return `This action updates a #${id} asignacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacione`;
  }
}
