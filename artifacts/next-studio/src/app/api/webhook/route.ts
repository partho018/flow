
import { NextRequest, NextResponse } from "next/server";
import { db, followers, profiles } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getSettings } from "@/lib/settingsStore";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming Webhook Body:", JSON.stringify(body, null, 2));

    // Handle Instagram Webhook Events
    if (body.object === "instagram" && body.entry) {
      for (const entry of body.entry) {
        const instagramBusinessId = entry.id;
        console.log(`Processing entry for IG Business ID: ${instagramBusinessId}`);
        
        // Find profile by Instagram Business ID
        let profile = await db.query.profiles.findFirst({
          where: eq(profiles.id, instagramBusinessId)
        });

        // Fallback: If not found by ID, take the first available profile (useful for testing/fake IDs)
        if (!profile) {
          console.log(`Profile NOT found for ID ${instagramBusinessId}. Attempting fallback to first profile.`);
          profile = await db.query.profiles.findFirst();
        }

        const activeProfile = profile;

        if (!activeProfile) {
          console.warn(`No profile found in database at all.`);
          continue;
        }
        
        console.log(`Using active profile: ${activeProfile.igUsername} (ID: ${activeProfile.id})`);

        // 1. Messaging events (Direct Messages)
        if (entry.messaging) {
          for (const message of entry.messaging) {
            const senderId = message.sender.id;
            await db.insert(followers).values({
              id: `fol_${senderId}_${Date.now()}`,
              profileId: activeProfile.id,
              username: "Interaction Recv",
              timestamp: new Date()
            }).onConflictDoNothing();
          }
        }

        // 2. Changes events (Followers, Comments etc)
        if (entry.changes) {
          for (const change of entry.changes) {
            console.log(`Webhook change field: ${change.field}`, JSON.stringify(change.value));
            
            if (change.field === "comments") {
              const comment = change.value;
              const commentId = comment.id;
              const commentText = comment.text || "";
              const mediaId = comment.media?.id || comment.media_id;
              const senderId = comment.from?.id;

              console.log(`Processing comment ${commentId} on media ${mediaId}: "${commentText}" from ${senderId}`);

              const settings = await getSettings(activeProfile.userId!);

              const automations = (settings as any).automations || [];

              const match = automations.find((a: any) => {
                const isActive = a.active;
                const isCommentTrigger = a.triggerType === 'comment';
                const postMatches = a.selectedPost?.id === 'all' || String(a.selectedPost?.id) === String(mediaId);
                
                let kwMatches = a.anyKw;
                if (!kwMatches) {
                  const kws = a.keywords || [];
                  kwMatches = kws.some((kw: string) => commentText.toLowerCase().includes(kw.toLowerCase()));
                }

                console.log(`Checking automation "${a.name}": active=${isActive}, type=${a.triggerType}, postMatch=${postMatches}, kwMatch=${kwMatches}`);
                return isActive && isCommentTrigger && postMatches && kwMatches;
              });

              if (match && match.replies && match.replies.length > 0) {
                console.log(`MATCH FOUND! Automation: ${match.name}`);
                const replyText = match.replies[Math.floor(Math.random() * match.replies.length)];

                const token = activeProfile.accessToken;
                if (token) {
                  try {
                    const replyUrl = `https://graph.facebook.com/v18.0/${commentId}/replies`;
                    const res = await fetch(replyUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        message: replyText,
                        access_token: token
                      })
                    });
                    
                    const resData = await res.json();
                    if (!res.ok) {
                      console.error("Failed to send IG reply:", JSON.stringify(resData));
                    } else {
                      console.log("IG public reply sent successfully");
                      
                      if (match.openingOn !== false) {
                        const openingMsg = match.openingMsg || "Please check your inbox!";
                        const privateReplyUrl = `https://graph.facebook.com/v18.0/${commentId}/private_replies`;
                        await fetch(privateReplyUrl, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            message: openingMsg,
                            access_token: token
                          })
                        }).then(r => r.json()).then(d => console.log("Private reply sent:", d)).catch(e => console.error("Private reply error:", e));
                      }

                      await db.update(profiles)
                        .set({ 
                          commentsCaught: sql`${profiles.commentsCaught} + 1`
                        })
                        .where(eq(profiles.id, activeProfile.id));
                    }
                  } catch (replyErr) {
                    console.error("Error sending IG reply:", replyErr);
                  }
                } else {
                  console.warn("No IG ACCESS_TOKEN found for replying");
                }
              }
            }

            if (change.field === "followers") {
              await db.insert(followers).values({
                id: `fol_change_${Date.now()}`,
                profileId: activeProfile.id,
                username: "New Follower Change",
                timestamp: new Date()
              }).onConflictDoNothing();
            }
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch(err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
