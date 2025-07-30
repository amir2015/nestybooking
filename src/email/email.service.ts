import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Booking } from 'src/bookings/entities/booking.entity';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  async sendBookingConfirmation(booking: Booking): Promise<void> {
    const pdfBuffer = await this.generateInvoicePDF(booking);
    const html = await this.getBookingConfirmationTemplate(booking);
    this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: booking.user.email,
      subject: 'Booking Confirmation',
      html,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }
  private async generateInvoicePDF(booking: Booking): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Booking Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Booking ID: ${booking.id}`);
      doc.text(`Check-in: ${booking.checkInDate}`);
      doc.text(`Check-out: ${booking.checkOutDate}`);
      doc.text(`Total Amount: $${booking.totalPrice}`);

      doc.end();
    });
  }
  private async getBookingConfirmationTemplate(
    booking: Booking,
  ): Promise<string> {
    return `
      <h1>Booking Confirmation</h1>
      <p>Dear ${booking.user.name},</p>
      <p>Your booking has been confirmed.</p>
      <p>Details:</p>
      <ul>
        <li>Hotel: ${booking.room.hotel.name}</li>
        <li>Room: ${booking.room.roomNumber}</li>
        <li>Check-in: ${booking.checkInDate}</li>
        <li>Check-out: ${booking.checkOutDate}</li>
        <li>Total Amount: $${booking.totalPrice}</li>
      </ul>
    `;
  }
}
