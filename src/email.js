import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
  {
    host: "localhost",
    port: 1025,
    secure: false, // Use `true` for port 465, `false` for all other ports
  },
  {
    from: '"Nerve" <nerve@nervekit.com>',
  },
);

export const send = {
  welcome: async (email) => {
    await transporter.sendMail({
      to: email,
      subject: "Welcome!",
      text: "Welcome to nerve!",
      html: "<h1>Welcome to nerve!</h1>",
    });
  },
  forgotPassword: async (email, token) => {
    await transporter.sendMail({
      to: email,
      subject: "Reset your forgotten password",
      text: `Use this token to reset your forgotten password: ${token}`,
      html: `<p>Use this token to reset your forgotten password: <pre>${token}</pre></p>`,
    });
  },
};
