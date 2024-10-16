export const userTemplate = (emailData: { name: string }) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SGC-Insurance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 10px 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 10px 20px;
            text-align: center;
            border-top: 1px solid #ddd;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to SGC-Insurance!</h1>
        </div>
        <div class="content">
            <p>Dear ${emailData.name},</p>
            <p>Welcome to SGC-Insurance! We are delighted to have you as a part of our community. At SGC-Insurance, we strive to provide you with the best services and support to meet your insurance needs.</p>
            <p>Here are a few things you can do to get started:</p>
            <ul>
                <li><strong>Log in to Your Account:</strong> Visit our website and log in with your email. , <a href="https://insurance-frontend-fork.vercel.app/auth/login" class="button">click here</a>, An OTP will be sent to your email to confirm.</li>
                <li><strong>Explore Our Services:</strong> Once logged in, you can explore the various insurance products and services we offer. Whether you're looking for health, life, auto, or home insurance, we have a range of options tailored to your needs.</li>
            </ul>
            <p>If you have any questions or need assistance, feel free to contact our support team at support@sgc-insurance.com.</p>
            <p>Thank you for choosing SGC-Insurance. We look forward to serving you!</p>
            <p>Best regards,<br>The SGC-Insurance Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 SGC-Insurance. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};
