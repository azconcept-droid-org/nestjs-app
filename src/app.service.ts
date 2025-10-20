import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { htmlToPdfBuffer } from './utils/pdfGenerator';
import * as path from 'path';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async generatePdf(id: number): Promise<Buffer> {
    const payment = {
      paymentRef: '12345678',
      rrrNo: 'RRR7890123',
      amount: 12000,
      currency: 'NGN',
      bankAccount: '0123456789',
    }

    const slipPath = path.join(
      process.cwd(),
      'src',
      'payment',
      'templates',
      'paymentReceipt.ejs',
    );

    const paymentData = {
      paymentRef: payment.paymentRef,
      rrrNo: payment.rrrNo,
      amountPaid: payment.amount,
      currency: payment.currency,
      bankAccount: { 
        bankName: 'exampleBank', accountNo: payment.bankAccount ,
        swiftCode: 'exampleBANKNGXXX', sortCode: '058152', intermediaryBank: 'N/A',
        intermediaryBankSwiftCode: 'N/A', bankAddress: 'N/A', accountName: 'example',
        address: 'N/A'
      },
      company: { name: 'example', email: 'info@example.com', phone: '+234 123 456 7890', nogicUniqueId: '1234567' },
    };

    const pdfBuffer = await htmlToPdfBuffer(slipPath, { payment: paymentData });

    if (!pdfBuffer) {
      throw new InternalServerErrorException('Failed to generate PDF');
    }

    return pdfBuffer;
  }
}
