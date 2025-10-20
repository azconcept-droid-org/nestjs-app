import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id/generate-slip')
  async generateSlip(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.appService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=payment-slip-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
