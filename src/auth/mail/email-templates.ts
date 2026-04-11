export type Role = 'seller' | 'admin';

interface EmailTemplate {
    subject: string;
    html: string;
}

export function getWelcomeEmail(name: string, role: Role): EmailTemplate {
    const year = new Date().getFullYear();

    const templates: Record<Role, EmailTemplate> = {
        seller: {
            subject: 'Your Seller Account is Ready!',
            html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:32px;">
          <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
            <div style="background:#0d9488;padding:20px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:20px;">Welcome to E-Commerce, ${name}!</h1>
            </div>
            <div style="padding:24px;">
              <p style="font-size:14px;color:#555;margin:0 0 16px;">Your seller account is approved. You can now list products and start selling.</p>
              <div style="text-align:center;">
                <a href="https://your-website.com/seller/dashboard" style="background:#0d9488;color:#fff;padding:10px 24px;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">Go to Dashboard</a>
              </div>
            </div>
            <div style="background:#f7f7f7;text-align:center;padding:12px;font-size:11px;color:#aaa;">© ${year} E-Commerce. All rights reserved.</div>
          </div>
        </div>`,
        },

        admin: {
            subject: '[Admin] Platform Access Granted',
            html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:32px;">
          <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
            <div style="background:#1e293b;padding:20px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:20px;">Admin Access Granted, ${name}!</h1>
            </div>
            <div style="padding:24px;">
              <p style="font-size:14px;color:#555;margin:0 0 12px;">Your administrator account is active. You have full access to manage the platform.</p>
              <div style="text-align:center;">
                <a href="https://your-website.com/admin" style="background:#1e293b;color:#fff;padding:10px 24px;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">Open Admin Panel</a>
              </div>
            </div>
            <div style="background:#f7f7f7;text-align:center;padding:12px;font-size:11px;color:#aaa;">© ${year} E-Commerce. All rights reserved.</div>
          </div>
        </div>`,
        },
    };

    return templates[role];
}