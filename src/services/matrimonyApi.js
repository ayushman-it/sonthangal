import { demoCredentials, profiles } from "../mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

function wait(delay = 180) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function createKundliPdf(profile) {
  function escapePdfText(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  const lines = [
    "Sonthangal Matrimony Kundli Summary",
    `Name: ${profile.name}`,
    `Match Score: ${profile.kundli.score}`,
    `Star: ${profile.star}`,
    `Zodiac: ${profile.zodiac}`,
    `Birth Time: ${profile.kundli.birthTime}`,
    `Birth Place: ${profile.kundli.birthPlace}`,
    `Manglik: ${profile.kundli.manglik}`,
  ];
  const stream = lines
    .map((line, index) => `BT /F1 13 Tf 50 ${760 - index * 26} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join("\n");
  pdf += `\ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function signInWithEmail({ email, password }) {
  if (USE_MOCK_API) {
    await wait();
    const isDemoUser =
      email.trim().toLowerCase() === demoCredentials.email &&
      password === demoCredentials.password;

    if (!isDemoUser) {
      throw new Error("Use the demo email and password to enter.");
    }

    return { token: "mock-session-token", user: { name: "Arjun K" } };
  }

  return request("/auth/login", {
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
}

export async function getMatches() {
  if (USE_MOCK_API) {
    await wait(120);
    return profiles;
  }

  return request("/matches");
}

export async function getProfileDetail(profileId) {
  if (USE_MOCK_API) {
    await wait(120);
    const profile = profiles.find((item) => item.id === profileId);

    if (!profile) {
      throw new Error("Profile not found.");
    }

    return profile;
  }

  return request(`/profiles/${profileId}`);
}

export async function downloadKundli(profileId) {
  const profile = await getProfileDetail(profileId);

  if (USE_MOCK_API) {
    return {
      blob: new Blob([createKundliPdf(profile)], { type: "application/pdf" }),
      fileName: profile.kundli.fileName,
    };
  }

  const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/kundli`);

  if (!response.ok) {
    throw new Error(`Kundli download failed: ${response.status}`);
  }

  return {
    blob: await response.blob(),
    fileName: profile.kundli.fileName || `sonthangal-kundli-${profileId}.pdf`,
  };
}

export function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
