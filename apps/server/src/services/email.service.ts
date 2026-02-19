class EmailService {
  async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: any;
  }) {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}

const emailService = new EmailService();
export default emailService;
