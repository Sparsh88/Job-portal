export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  console.log(`✉️ [Email Service] Sending Email to: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body Snippet: ${html.substring(0, 100)}...`);
  return true;
};
