import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeaderboardEntry {
  email: string;
  score: number;
  date: string;
}

// Get access token using service account
async function getAccessToken(): Promise<string> {
  const privateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')!.replace(/\\n/g, '\n');
  const clientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL')!;
  
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claimB64 = btoa(JSON.stringify(claimSet)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${headerB64}.${claimB64}`;

  // Import the private key
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signatureInput}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  console.log('Token response status:', tokenResponse.status);
  
  if (!tokenData.access_token) {
    console.error('Token error:', tokenData);
    throw new Error('Failed to get access token');
  }
  
  return tokenData.access_token;
}

// Save score to Google Sheets
async function saveScore(entry: LeaderboardEntry): Promise<void> {
  const accessToken = await getAccessToken();
  const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID')!;
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[entry.email, entry.score, entry.date]],
    }),
  });

  const result = await response.json();
  console.log('Save score response:', response.status, result);
  
  if (!response.ok) {
    throw new Error(`Failed to save score: ${JSON.stringify(result)}`);
  }
}

// Get all scores from Google Sheets
async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const accessToken = await getAccessToken();
  const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID')!;
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:C`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log('Get leaderboard response:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to get leaderboard: ${JSON.stringify(data)}`);
  }

  const values = data.values || [];
  
  // Skip header row if it exists
  const startIndex = values.length > 0 && values[0][0]?.toLowerCase() === 'email' ? 1 : 0;
  
  return values.slice(startIndex).map((row: string[]) => ({
    email: row[0] || '',
    score: parseInt(row[1] || '0', 10),
    date: row[2] || new Date().toISOString(),
  })).filter((entry: LeaderboardEntry) => entry.email);
}

// Check if user has already played
async function hasUserPlayed(email: string): Promise<boolean> {
  const leaderboard = await getLeaderboard();
  return leaderboard.some(entry => entry.email.toLowerCase() === email.toLowerCase());
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('Request action:', action);

    if (action === 'save-score' && req.method === 'POST') {
      const body = await req.json();
      const entry: LeaderboardEntry = {
        email: body.email,
        score: body.score,
        date: body.date || new Date().toISOString(),
      };
      
      await saveScore(entry);
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get-leaderboard') {
      const leaderboard = await getLeaderboard();
      
      return new Response(
        JSON.stringify({ leaderboard }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-played') {
      const email = url.searchParams.get('email');
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const hasPlayed = await hasUserPlayed(email);
      
      return new Response(
        JSON.stringify({ hasPlayed }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
