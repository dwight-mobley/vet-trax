import { getPetReminderEmailHtml } from "@/templates/emails/NotificationReminder";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

//Types
interface Pet {
  name: string;
  owner_id: string;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  // Security Check: Ensure only your Cron service can trigger this
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Get today's date as a clean "YYYY-MM-DD" string
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // 2. Get the date 10 days from now as a clean "YYYY-MM-DD" string
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(today.getDate() + 10);
    const tenDaysStr = tenDaysFromNow.toISOString().split("T")[0];


    // 3. Execute the query with matching data formats

    const notifiedIds: string[] = [];
    const notificationsToSend: { email: string; reminders: { title: string; due_date: string; pet_name: string }[] }[] = [];
    const { data: reminders, error: fetchError } = await supabase.from("reminders").select("id, due_date, title, pets(name, owner_id)").lte("due_date", tenDaysStr).or(`last_notified_at.is.null,last_notified_at.lt.${todayStr}`);

    if (fetchError) throw fetchError;
    for (const reminder of reminders) {

      // Fetch the pet's owner email
      const {
        data: {
          user: { email },
        },
      } = await supabase.auth.admin.getUserById(reminder.pets.owner_id);

      //Add to notifications list
      notifiedIds.push(reminder.id);

      // Check if we already have a notification entry for this email
      const existingNotification = notificationsToSend.find((n) => n.email === email);
      if (existingNotification) {
        existingNotification.reminders.push({
          title: reminder.title,
          due_date: reminder.due_date,
          pet_name: reminder.pets.name,
        });
      } else {
        notificationsToSend.push({
          email: email,
          reminders: [
            {
              title: reminder.title,
              due_date: reminder.due_date,
              pet_name: reminder.pets.name,
            },
          ],
        });
      }
    }

    // Use Resend To Send Emails
    for (const notification of notificationsToSend) {
      const emailBody = getPetReminderEmailHtml(notification.reminders);
      await fetch("https://api.resend.com/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "VetTrax <no-reply@holysmokesengraving.com>",
          to: notification.email,
          subject: "Upcoming Pet Reminders",
          html: emailBody,
        }),
      });
    }

    // 3. Update the last_notified_date for the processed reminders
    if (notifiedIds.length > 0) {
      const { error: updateError } = await supabase
        .from("reminders")
        .update({ last_notified_at: new Date().toISOString().split("T")[0] })
        .in("id", notifiedIds);

      if (updateError) throw updateError;
    }

    return NextResponse.json({
      success: true,
      sentCount: notifiedIds.length,
    });
  } catch (error) {
    console.log("Error in send-reminders cron:", error);
    return NextResponse.json({ error: "Failed To Send Reminders" }, { status: 500 });
  }
}
