import { json } from "@sveltejs/kit";
import { BREVO_API_KEY } from '$env/static/private'

const logo = "https://nwu-vaal-gkss.netlify.app/icon.png"; // Logo URL

const emailTemplate = (message, fullName) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100vw;
          }
          .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              padding: 30px;
              max-width: 600px;
              text-align: center;
          }
          .logo {
              width: 150px;
              margin-bottom: 20px;
          }
          h2 {
              color: #333;
              margin-bottom: 15px;
          }
          p {
              line-height: 1.6;
              color: #555;
              font-size: 16px;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${logo}" alt="Logo" class="logo" />
          <h2>Dear ${fullName},</h2>
          <p>${message}</p>
          <br/><br/>
          <p>If you need help or have a suggestion, let us know in the group chat</p>
          <p>This message was sent from the NWU Vaal GKSS website. <a href="https://nwu-vaal-gkss.netlify.app">https://nwu-vaal-gkss.netlify.app</a></p>
          <br/>

          
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NWU VAAL GKSS. All rights reserved.</p>
          </div>
      </div>
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
    const {data: member, error} = await supabase.from("Member").select().eq("id",user.id);
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
          sender: { email: 'gkssvaal@gmail.com', name: 'NWU VAAL GKSS' },
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
  