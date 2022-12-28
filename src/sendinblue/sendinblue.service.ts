import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { SendEmailDto } from 'src/auth/dto/send-email.dto';

@Injectable()
export class SendinblueService {
  constructor(private httpService: HttpService) {}
  async sendEmail(data: SendEmailDto) {
    const resData = await lastValueFrom(
      this.httpService
        .post('https://api.sendinblue.com/v3/smtp/email', data, {
          headers: {
            accept: 'application/json',
            'api-key': process.env.EMAIL_KEY,
            'content-type': 'application/json',
          },
        })
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError(() => {
            throw new BadGatewayException();
          }),
        ),
    );
    return resData;
  }
}
