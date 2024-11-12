import { Resend } from "resend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode
) => {
  const resend = new Resend(process.env.RESEND_API_KEY as string);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    react: template,
  });

  if (error) {
    throw error;
  }

  return data;
};
