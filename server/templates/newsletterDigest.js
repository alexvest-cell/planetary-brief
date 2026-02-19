
export const generateWeeklyDigest = (data) => {
    const {
        intro,
        featuredArticle,
        supportingArticles = [],
        metricSnapshot,
        unsubscribeUrl = "{{ unsubscribe_url }}" // Kit placeholder
    } = data;

    // Helper for arrays
    const supportList = supportingArticles.map(article => `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #27272a;">
            <h3 style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.4; font-weight: 700;">
                <a href="https://planetarybrief.com/article/${article.slug || article.id}" style="color: #ffffff; text-decoration: none;">${article.title}</a>
            </h3>
            <p style="margin: 0 0 12px 0; font-family: 'Georgia', serif; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                ${article.excerpt || article.tease || ''}
            </p>
            <a href="https://planetarybrief.com/article/${article.slug || article.id}" style="display: inline-block; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; color: #10b981; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">
                Read Analysis &rarr;
            </a>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planetary Brief Weekly Intelligence</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; color: #e4e4e7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

    <!-- Outer Background Wrapper (Ensures black bg in all clients) -->
    <div style="width: 100%; background-color: #000000; padding: 20px 0;">

        <!-- Main Container -->
        <div style="max-width: 680px; margin: 0 auto; background-color: #09090b; overflow: hidden; border: 1px solid #27272a;">
            
            <!-- Header -->
            <div style="padding: 40px 24px 24px 24px; border-bottom: 1px solid #27272a; text-align: center;">
                <div style="font-family: 'Georgia', serif; font-size: 24px; letter-spacing: -0.02em; color: #ffffff; margin-bottom: 8px;">
                    <span style="color: #10b981;">Planetary</span>Brief
                </div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a; font-weight: 600;">
                    Weekly Intelligence Update
                </div>
            </div>

            <!-- Intro -->
            <div style="padding: 32px 24px;">
                <div style="font-family: 'Georgia', serif; font-size: 16px; line-height: 1.6; color: #d4d4d8; margin-bottom: 32px;">
                    ${intro ? intro.replace(/\n/g, '<br/>') : "Here's your weekly update on critical environmental systems."}
                </div>

                <!-- Featured Article -->
                ${featuredArticle ? `
                <div style="margin-bottom: 40px; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
                    ${featuredArticle.imageUrl ? `
                    <a href="https://planetarybrief.com/article/${featuredArticle.slug || featuredArticle.id}" style="display: block;">
                        <img src="${featuredArticle.imageUrl}" alt="${featuredArticle.title}" style="display: block; width: 100%; height: auto; border: 0;">
                    </a>
                    ` : ''}
                    <div style="padding: 24px;">
                        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981; margin-bottom: 12px;">
                            Featured Insight
                        </div>
                        <h2 style="margin: 0 0 12px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 22px; line-height: 1.3; font-weight: 700;">
                            <a href="https://planetarybrief.com/article/${featuredArticle.slug || featuredArticle.id}" style="color: #ffffff; text-decoration: none;">${featuredArticle.title}</a>
                        </h2>
                        <p style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
                            ${featuredArticle.excerpt || ''}
                        </p>
                        <a href="https://planetarybrief.com/article/${featuredArticle.slug || featuredArticle.id}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; padding: 10px 20px; border-radius: 4px;">
                            Read Full Briefing
                        </a>
                    </div>
                </div>
                ` : ''}

                <!-- Divider -->
                <div style="height: 1px; background-color: #27272a; margin: 0 0 32px 0;"></div>

                <!-- Supporting Briefs -->
                <div style="margin-bottom: 32px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 20px;">
                        Systems Monitor
                    </div>
                    ${supportList}
                </div>

                <!-- Metric Snapshot -->
                ${metricSnapshot ? `
                <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 12px;">
                        PlanetDash Snapshot
                    </div>
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                        ${metricSnapshot.value}
                    </div>
                    <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981; margin-bottom: 8px;">
                        ${metricSnapshot.label}
                    </div>
                    <div style="font-family: 'Georgia', serif; font-size: 13px; font-style: italic; color: #a1a1aa;">
                        ${metricSnapshot.change || ''} ${metricSnapshot.trend ? `(${metricSnapshot.trend})` : ''}
                    </div>
                </div>
                ` : ''}

            </div>

            <!-- Footer -->
            <div style="padding: 24px; background-color: #000000; text-align: center; border-top: 1px solid #27272a;">
                <div style="font-size: 11px; color: #52525b; line-height: 1.5; margin-bottom: 16px;">
                    You are receiving this email because you subscribed to Planetary Brief intelligence updates.
                </div>
                <a href="${unsubscribeUrl}" style="font-size: 11px; color: #71717a; text-decoration: underline;">
                    Manage Preferences or Unsubscribe
                </a>
                <div style="margin-top: 16px; font-family: 'Georgia', serif; font-size: 12px; color: #3f3f46;">
                    Greenshift Environmental Intelligence
                </div>
            </div>

        </div>
    </div>

</body>
</html>
    `;
};
