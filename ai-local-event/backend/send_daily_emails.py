from supabase_client import supabase
from email_utils import send_email

def get_all_events():
    events = supabase.table("events").select("*").execute().data
    print(f"📦 Total events in DB: {len(events)}")
    return events

def build_html(events):
    if not events:
        return "<p>No events available right now.</p>"

    html = "<h2>🎉 All Current Events</h2><ul>"
    for e in events:
        title = e.get('title', 'Untitled Event')
        link = e.get('url') or e.get('link') or "#"
        html += f'<li><b>{title}</b><br><a href="{link}" target="_blank">View Event</a></li><br>'
    html += "</ul>"
    return html

def main():
    subscribers = supabase.table("subscriptions").select("*").execute().data
    all_events = get_all_events()
    html_body = build_html(all_events)

    for user in subscribers:
        email = user["email"]
        try:
            send_email(
                to=email,
                subject="Your Event Newsletter",
                message=html_body
            )
            print(f"📨 Sent to {email}")
        except Exception as e:
            print(f"❌ Failed to send to {email}: {e}")

if __name__ == "__main__":
    main()
