import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SendinblueService } from './sendinblue.service';

@Module({
  imports: [HttpModule],
  providers: [SendinblueService],
  exports: [SendinblueService],
})
export class SendinblueModule {}
