const SibApiV3Sdk = require("@getbrevo/brevo");
import { ENV } from "~/config/environments";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = ENV.BREVO_API_KEY;

const SendEmail = async (recipientEmail: string, customSubject: string, customHtmlContent: string) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: ENV.ADMIN_EMAIL_ADDRESS,
    name: ENV.ADMIN_EMAIL_NAME,
  };
  sendSmtpEmail.to = [{ email: recipientEmail }];
  sendSmtpEmail.subject = customSubject;
  sendSmtpEmail.htmlContent = customHtmlContent;

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export default SendEmail;
