import { NextResponse } from "next/server";

// Searches Spotify's catalogue for the site-wide music player.
// Uses the Client Credentials flow, so visitors never need to log in here and
// the client secret stays on the server. Set SPOTIFY_CLIENT_ID and
// SPOTIFY_CLIENT_SECRET in .env.local (and in your hosting provider's env vars).

type CachedToken = { value: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

type SpotifyTrack = {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
};

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100);
  if (!q) return NextResponse.json({ tracks: [] });

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  if (!res.ok) {
    return NextResponse.json({ error: "search_failed" }, { status: 502 });
  }

  const data = (await res.json()) as { tracks: { items: SpotifyTrack[] } };
  const tracks = data.tracks.items.map((t) => {
    const images = [...t.album.images].sort((a, b) => a.width - b.width);
    const art = images.find((i) => i.width >= 200) ?? images[images.length - 1];
    return {
      id: t.id,
      uri: t.uri,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      art: art?.url ?? "",
    };
  });

  return NextResponse.json(
    { tracks },
    { headers: { "Cache-Control": "public, s-maxage=300" } }
  );
}
