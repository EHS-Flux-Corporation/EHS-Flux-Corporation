/**
 * Vercel serverless function — /api/contact
 *
 * Receives validated enquiry data from the contact form, validates again on the
 * server, sanitises against HTML injection, applies rate limiting, and forwards
 * the enquiry to info@ehsflux.com via Resend.
 *
 * Required environment variables (set in Vercel project settings):
 *   RESEND_API_KEY       — Resend API key
 *   CONTACT_FROM_EMAIL  — Sender email authorised by Resend (e.g. onboarding@ehsflux.com or enquiries@ehsflux.com)
 *   CONTACT_TO_EMAIL     — Recipient enquiry inbox: info@ehsflux.com
 *
 * Live email delivery requires:
 *   1. A verified sending domain in your Resend account (e.g. ehsflux.com).
 *   2. CONTACT_FROM_EMAIL set to an address on that verified domain.
 *   3. The three environment variables configured in Vercel.
 *
 * If any variable is missing, the API returns a 500 with a clear configuration
 * message so the operator can finish setup. The frontend then falls back to a
 * helpful message that prompts the visitor to email directly.
 */

const MAX_BODY = 16 * 1024; // 16KB max body size
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3;             // max 3 submissions per minute per IP

// In-memory rate-limit store (per serverless instance — sufficient for a single
// company enquiry form). For higher volume, swap for Upstash/KV.
const rateMap = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (entry && (now - entry.start) < RATE_LIMIT_WINDOW) {
    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) return false;
  } else {
    rateMap.set(ip, { start: now, count: 1 });
  }
  return true;
}

// Pragmatic email regex (RFCs are looser than this, but this is what we accept)
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const E164_RE = /^\+[1-9]\d{6,14}$/;

// HTML-escape for safe inclusion in the email body (defence in depth — Resend
// also handles escaping, but we never trust user input).
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req) {
  // Vercel proxies populate x-forwarded-for with the real client IP
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

function validatePayload(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body.'] };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const requirement = typeof body.requirement === 'string' ? body.requirement.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 120) errors.push('Full name must be 2–120 characters.');
  if (company.length > 120) errors.push('Company name must be 120 characters or fewer.');
  if (!EMAIL_RE.test(email)) errors.push('A valid email address is required.');
  if (!E164_RE.test(phone)) errors.push('A valid international phone number (E.164) is required.');

  const ALLOWED_REQUIREMENTS = [
    'Water Treatment Plant Consulting',
    'ZLD System Consulting',
    'ETP Audit / Upgradation',
    'Feasibility Study',
    'Project Support',
    'Compliance Support',
    'Other'
  ];
  if (!ALLOWED_REQUIREMENTS.includes(requirement)) errors.push('A valid requirement selection is required.');

  if (subject.length < 3 || subject.length > 200) errors.push('Subject must be 3–200 characters.');
  if (message.length < 10 || message.length > 4000) errors.push('Message must be 10–4000 characters.');

  // Honeypot check — if "website" field is filled, silently reject.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return { valid: false, errors: ['spam'], silent: true };
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { name, company, email, phone, requirement, subject, message, phoneCountry: body.phoneCountry, sourcePage: body.sourcePage }
  };
}

function buildEmailHtml(data, ts) {
  const rows = [
    ['Full Name', data.name],
    ['Company', data.company || '—'],
    ['Email', data.email],
    ['Phone', data.phone + (data.phoneCountry ? ' (' + data.phoneCountry + ')' : '')],
    ['Requirement', data.requirement],
    ['Subject', data.subject],
    ['Source Page', data.sourcePage || '—'],
    ['Submitted At', ts + ' (UTC)']
  ];

  const rowsHtml = rows.map(function (r) {
    return '<tr><td style="padding:8px 14px;border:1px solid #e3e8ef;background:#f5fafe;color:#52677D;font-weight:600;font-size:13px;width:160px;vertical-align:top;">' +
      escapeHtml(r[0]) +
      '</td><td style="padding:8px 14px;border:1px solid #e3e8ef;color:#17324D;font-size:14px;vertical-align:top;">' +
      escapeHtml(r[1]) +
      '</td></tr>';
  }).join('');

  const messageBlock =
    '<div style="margin-top:24px;padding:20px;background:#F5FAFE;border:1px solid #D8EAF7;border-radius:8px;">' +
    '<div style="font-size:13px;font-weight:700;color:#0969B8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Message</div>' +
    '<div style="font-size:14px;color:#17324D;line-height:1.6;white-space:pre-wrap;">' + escapeHtml(data.message) + '</div>' +
    '</div>';

  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>New Enquiry</title></head>' +
    '<body style="font-family:Inter,Arial,sans-serif;background:#ffffff;color:#17324D;margin:0;padding:24px 0;">' +
    '<div style="max-width:560px;margin:0 auto;padding:32px 24px;border:1px solid #D8EAF7;border-radius:12px;background:#ffffff;">' +
    '<div style="border-bottom:3px solid #16A9E8;padding-bottom:16px;margin-bottom:20px;">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#16A9E8;text-transform:uppercase;">EHS Flux Corporation</div>' +
    '<div style="font-size:20px;font-weight:700;color:#073B70;margin-top:4px;">New Website Enquiry</div>' +
    '</div>' +
    '<p style="font-size:14px;color:#52677D;margin:0 0 16px;">A new enquiry was submitted through the EHS Flux Corporation website contact form.</p>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + rowsHtml + '</table>' +
    messageBlock +
    '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #D8EAF7;font-size:12px;color:#52677D;">' +
    'Reply directly to this email to respond to <strong>' + escapeHtml(data.email) + '</strong>.' +
    '</div>' +
    '</div>' +
    '</body></html>'
  );
}

function buildEmailText(data, ts) {
  return [
    'NEW ENQUIRY — EHS Flux Corporation',
    'Submitted: ' + ts + ' (UTC)',
    'Source Page: ' + (data.sourcePage || '—'),
    '',
    'Full Name : ' + data.name,
    'Company   : ' + (data.company || '—'),
    'Email     : ' + data.email,
    'Phone     : ' + data.phone + (data.phoneCountry ? ' (' + data.phoneCountry + ')' : ''),
    'Requirement: ' + data.requirement,
    'Subject   : ' + data.subject,
    '',
    'Message:',
    '----------------------------------------',
    data.message,
    '----------------------------------------',
    '',
    'Reply-To: ' + data.email
  ].join('\n');
}

module.exports = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  // CORS — same-origin / vary origin
  res.setHeader('Vary', 'Origin');

  // Body size guard
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_BODY) {
    return res.status(413).json({ success: false, error: 'Request too large.' });
  }

  // Read body safely whether it arrives parsed (Vercel runtime), as string/Buffer,
  // or as a stream/async iterable (Node.js IncomingMessage or unit test mock)
  let body;
  try {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && typeof req.body[Symbol.asyncIterator] !== 'function') {
      // Vercel serverless runtime automatically parses JSON bodies
      body = req.body;
    } else if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else if (Buffer.isBuffer(req.body)) {
      body = JSON.parse(req.body.toString('utf8'));
    } else {
      const stream = (req.body && typeof req.body[Symbol.asyncIterator] === 'function')
        ? req.body
        : (typeof req[Symbol.asyncIterator] === 'function' ? req : null);

      if (stream) {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');
        body = raw ? JSON.parse(raw) : {};
      } else {
        body = {};
      }
    }
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid JSON.' });
  }

  // Rate limit
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return res.status(429).json({ success: false, error: 'Too many submissions. Please try again in a minute.' });
  }

  // Validate
  const result = validatePayload(body);
  if (!result.valid) {
    if (result.silent) {
      // Honeypot triggered — pretend success to confuse bots
      return res.status(200).json({ success: true, message: 'Thank you for your enquiry.' });
    }
    return res.status(422).json({ success: false, error: 'Validation failed.', details: result.errors });
  }

  const data = result.data;
  const ts = new Date().toISOString();

  // Check env vars
  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  const CONTACT_FROM_EMAIL = (process.env.CONTACT_FROM_EMAIL || '').trim();
  const CONTACT_TO_EMAIL = (process.env.CONTACT_TO_EMAIL || 'info@ehsflux.com').trim();

  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) {
    console.error('Missing required environment variables: RESEND_API_KEY and/or CONTACT_FROM_EMAIL.');
    return res.status(500).json({
      success: false,
      error: 'Email delivery is not yet configured. Please contact the site administrator.'
    });
  }

  // Send via Resend
  const emailPayload = {
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    reply_to: data.email,
    subject: '[EHS Flux Enquiry] ' + data.subject,
    html: buildEmailHtml(data, ts),
    text: buildEmailText(data, ts),
    headers: {
      'X-Enquiry-Source': 'EHS Flux Website',
      'X-Enquiry-Phone-Country': data.phoneCountry || ''
    }
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Resend API error:', response.status, JSON.stringify(responseBody));
      return res.status(502).json({
        success: false,
        error: 'Email delivery provider returned an error. Please try again later or email us directly at info@ehsflux.com.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry received. Our team will respond shortly.',
      messageId: responseBody.id || null
    });
  } catch (err) {
    console.error('Resend request failed:', err.message);
    return res.status(502).json({
      success: false,
      error: 'Email delivery failed. Please email us directly at info@ehsflux.com.'
    });
  }
};
