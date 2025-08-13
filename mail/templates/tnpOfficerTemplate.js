const tnpOfficerTemplate = (name, link) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}

			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}

			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}

			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}

			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}

			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}

			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}

			.highlight {
				color: #0000FF;
			}
		</style>

	</head>

	<body>
		<div class="container">
			<div class="message">Create your account</div>
			<div class="body">
				<p>Dear ${name},</p>
				<p>Welcome to the Training and Placement Portal of Katihar Engineering College, Katihar. To complete your registration, please click on the following link to create your account:</p>
				<a href=${link} class="highlight">${link}</a>
				<p>This link will expire in 24 hours. If you did not request this verification, please disregard this email.</p>
				<p>Once your account is verified, you will have full access to manage the portal and its administrative features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:tpo@keck.ac.in">TPO KEC</a>. We are here to support you!</div>
		</div>
	</body>

	</html>`;
};

module.exports = tnpOfficerTemplate;
