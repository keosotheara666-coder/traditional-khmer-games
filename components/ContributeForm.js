"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { createEntry } from "../app/contribute/actions.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const BRASS = "#B8860B";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

// OWASP file-upload guidance: only images, a size cap, a randomised filename,
// and a type decided from the file's real bytes (magic numbers), never from the
// browser's MIME label. Storing as an image type stops sniffing it as HTML.
const MAX_BYTES = 5 * 1024 * 1024;
const EXT_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function detectImageType(bytes) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e &&
    bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a &&
    bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 &&
    bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 &&
    bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

const INPUT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function validate({ title, description, place, photo }) {
  const errors = {};
  const t = title.trim();
  const d = description.trim();
  const p = place.trim();
  if (!t) errors.title = "Title is required.";
  if (!d) errors.description = "Description is required.";
  else if (d.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }
  if (!p) errors.place = "Place is required.";
  if (!photo) errors.photo = "A photo is required.";
  return errors;
}

const styles = {
  card: {
    padding: "40px 32px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: GOLD_LIGHT,
    fontSize: 13,
    letterSpacing: 2,
    margin: 0,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    margin: "14px 0 26px",
    color: CREAM,
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: 13,
    color: MUTED,
    margin: "16px 0 6px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    background: "#17120A",
    color: CREAM,
    fontSize: 15,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 110,
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    background: "#17120A",
    color: CREAM,
    fontSize: 15,
    resize: "vertical",
  },
  file: {
    width: "100%",
    color: MUTED,
    fontSize: 14,
    marginTop: 6,
  },
  fieldError: {
    margin: "6px 0 0",
    color: "#E0805A",
    fontSize: 13,
  },
  button: {
    width: "100%",
    marginTop: 24,
    padding: 13,
    borderRadius: 8,
    border: "none",
    background: `linear-gradient(90deg, ${GOLD}, ${BRASS})`,
    color: "#17120A",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  banner: {
    marginTop: 18,
    padding: "10px 14px",
    border: `1px solid ${GOLD}`,
    borderRadius: 8,
    color: GOLD_LIGHT,
    fontSize: 14,
    textAlign: "center",
  },
};

export default function ContributeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function clearField(field) {
    if (errors[field]) {
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const nextErrors = validate({ title, description, place, photo });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setBusy(true);

    const supabase = createClient();

    // Re-confirm the session before uploading; owner is set server-side.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("Your session has expired. Please log in and try again.");
      return;
    }

    // Verify the real file bytes are an allowed image.
    let detected;
    try {
      detected = detectImageType(new Uint8Array(await photo.arrayBuffer()));
    } catch {
      detected = null;
    }
    if (!detected) {
      setBusy(false);
      setErrors({
        photo: "Only JPG, PNG, WebP, or GIF images are allowed.",
      });
      return;
    }
    if (photo.size > MAX_BYTES) {
      setBusy(false);
      setErrors({ photo: "The photo must be 5 MB or smaller." });
      return;
    }

    const storagePath = `${user.id}/${crypto.randomUUID()}.${EXT_BY_TYPE[detected]}`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, photo, { contentType: detected });

    if (uploadError) {
      console.error("Photo upload to storage failed:", uploadError);
      setBusy(false);
      setError("The photo could not be uploaded. Please try again.");
      return;
    }

    const { data: pub } = supabase.storage
      .from("photos")
      .getPublicUrl(storagePath);

    const result = await createEntry({
      title: title.trim(),
      description: description.trim(),
      place: place.trim(),
      photoUrl: pub.publicUrl,
    });

    if (result.error) {
      setBusy(false);
      setError(result.error);
      return;
    }

    router.push(`/entries/${result.id}`);
  }

  return (
    <div style={styles.card}>
      <p style={styles.kicker}>
        KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
      </p>
      <h1 style={styles.title}>Contribute an entry</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label style={styles.label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearField("title");
          }}
          aria-invalid={errors.title ? "true" : undefined}
          style={styles.input}
        />
        {errors.title && (
          <p style={styles.fieldError} role="alert">
            {errors.title}
          </p>
        )}

        <label style={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearField("description");
          }}
          aria-invalid={errors.description ? "true" : undefined}
          style={styles.textarea}
        />
        {errors.description && (
          <p style={styles.fieldError} role="alert">
            {errors.description}
          </p>
        )}

        <label style={styles.label} htmlFor="place">
          Place
        </label>
        <input
          id="place"
          type="text"
          value={place}
          onChange={(e) => {
            setPlace(e.target.value);
            clearField("place");
          }}
          aria-invalid={errors.place ? "true" : undefined}
          style={styles.input}
        />
        {errors.place && (
          <p style={styles.fieldError} role="alert">
            {errors.place}
          </p>
        )}

        <label style={styles.label} htmlFor="photo">
          Photo
        </label>
        <input
          id="photo"
          type="file"
          accept={INPUT_ACCEPT}
          onChange={(e) => {
            setPhoto(e.target.files && e.target.files[0]);
            clearField("photo");
          }}
          aria-invalid={errors.photo ? "true" : undefined}
          style={styles.file}
        />
        {errors.photo && (
          <p style={styles.fieldError} role="alert">
            {errors.photo}
          </p>
        )}

        <button type="submit" disabled={busy} style={styles.button}>
          {busy ? "Uploading and saving…" : "Save entry"}
        </button>
      </form>

      {error && (
        <p role="alert" style={styles.banner}>
          {error}
        </p>
      )}
    </div>
  );
}