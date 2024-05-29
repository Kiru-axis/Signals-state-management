import { Module } from '@nestjs/common';
import { ClientLocationsService } from './client-locations.service';
import { ClientLocationsController } from './client-locations.controller';

@Module({
  controllers: [ClientLocationsController],
  providers: [ClientLocationsService],
})
export class ClientLocationsModule {}
