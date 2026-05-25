interface Reminder {
  title: string;
  pet_name: string;
  due_date: string;
}

export function getPetReminderEmailHtml(reminders: Reminder[]): string {
 
  const reminderRowsHtml = reminders
    .map((r) => `
      <tr style="border-bottom: 1px solid #CBD5E1;">
        <td style="padding: 14px 0; font-weight: 600; color: #0F172A; font-size: 15px;">${r.pet_name}</td>
        <td style="padding: 14px 0; color: #64748b; font-size: 15px;">${r.title}</td>
        <td style="padding: 14px 0; color: #EF4444; font-weight: 600; font-size: 15px; text-align: right;">${r.due_date}</td>
      </tr>
    `)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upcoming Pet Reminders</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: Inter, ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); overflow: hidden; border: 1px solid #CBD5E1;">

              <tr>
                <td style="background-color: #0F766E; padding: 36px 32px; text-align: left; border-bottom: 4px solid #2DD4BF;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td>
                        <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 700; letter-spacing: -0.03em;">VetTrax</h1>
                        <p style="margin: 6px 0 0 0; color: #2DD4BF; font-size: 14px; font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase;">Medical Care Notification</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 32px;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #0F172A; font-weight: 600;">
                    Hello,
                  </p>
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748B;">
                    Our records indicate that the following health and wellness milestones require attention for your pets. Keeping up with these dates ensures they remain healthy and active.
                  </p>

                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 36px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #0F766E; text-align: left;">
                        <th style="padding-bottom: 10px; color: #0F172A; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Pet Name</th>
                        <th style="padding-bottom: 10px; color: #0F172A; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Requirement</th>
                        <th style="padding-bottom: 10px; color: #0F172A; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Status / Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${reminderRowsHtml}
                    </tbody>
                  </table>

                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <a href="https://vet-trax.dwight-mobley.com/dashboard" style="display: inline-block; background-color: #F97316; color: #FFFFFF; font-weight: 600; font-size: 15px; padding: 14px 36px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: background-color 0.2s ease;">
                          Manage Reminders Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="background-color: #F8FAFC; padding: 28px 32px; text-align: center; border-top: 1px solid #CBD5E1;">
                  <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748B;">
                    <strong>VetTrax Medical Systems</strong> &copy; ${new Date().getFullYear()} All rights reserved.
                  </p>
                  <p style="margin: 6px 0 0 0; font-size: 11px; line-height: 1.4; color: #CBD5E1;">
                    This tracking notification system processes background telemetry securely. You are receiving daily prompts because these records have crossed into a critical execution timeline.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}