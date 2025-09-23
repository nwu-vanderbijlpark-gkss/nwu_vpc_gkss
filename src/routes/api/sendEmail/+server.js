import { json } from "@sveltejs/kit";
import { BREVO_API_KEY } from '$env/static/private'
import { gkssConfig } from "$lib/config.ts";

const logo = gkssConfig.url + "/icon.png"; // Logo URL

const emailTemplate = (message, fullName) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Notification</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333333;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .container {
            padding: 40px 30px;
            text-align: left;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
        }
        .logo {
            max-width: 180px;
            height: auto;
            display: block;
            margin: 0 auto;
            border-radius: 4px;
        }
        h2 {
            font-size: 24px;
            color: #1a3c6e;
            margin: 20px 0 15px;
            font-weight: 600;
        }
        p {
            font-size: 16px;
            color: #4a4a4a;
            margin: 10px 0;
        }
        a {
            color: #005b99;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        .footer a {
            color: #6b7280;
        }
        /* Ensure responsiveness */
        @media only screen and (max-width: 600px) {
            table {
                width: 90%;
            }
            .container {
                padding: 20px;
            }
            .logo {
                max-width: 150px;
            }
            h2 {
                font-size: 20px;
            }
            p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <table role="presentation">
        <tr>
            <td class="container">
                <div class="header">
                    <img src="${logo}" alt="${gkssConfig.name} Logo" class="logo" />
                </div>
                <h2>Dear, ${fullName}</h2>
                <p>${message}</p>
                <p>If you need assistance or have suggestions, please reach out via our group chat.</p>
                <p>This message was sent from the ${gkssConfig.name} website: <a href="${gkssConfig.url}">${gkssConfig.url}</a></p>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ${gkssConfig.name}. All rights reserved.</p>
                    <p><a href="${gkssConfig.url}">Visit our website</a></p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`;


export const POST = async ({request, locals:{supabase}}) => {
    let { data } = await request.json();

    const {data:{user}} = await supabase.auth.getUser();
    
    let email = data.email;
    //get the member's full name
    let fullName = data.fullName ? data.fullName : "student";

    fullName = data.hideSalutations ? "student": fullName;

    const {data: member, error} = await supabase.from("member").select().eq("id",user.id);
    
    if(member[0].name && data.type != "broadcast"){
        fullName = member[0].name + " " + member[0].surname;
        email = user.email;
    }
    //event registration, event attendance, quiz completion and mass emailing from executive
    // Use the Brevo API
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { email: gkssConfig.socials.email, name: gkssConfig.name },
          to: [{ email }],
          subject: data.subject,
          htmlContent: emailTemplate(data.message, fullName),
        }),
      });
  
      if (response.ok) {
        return json({success: true})
        // Optionally return success message for the student email
      } else {
        const errorData = await response.json();
        return json({error: errorData, success: false})
        // Optionally handle error for the student email
      }
    } catch (error) {
      // Optionally handle network error for the student email
    }
  
  };
  