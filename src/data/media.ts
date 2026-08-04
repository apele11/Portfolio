const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];

/**
 * Cover URLs come from the CMS and may point at either a still or a clip.
 * Firebase Storage percent-encodes the object path and appends
 * `?alt=media&token=…`, so the extension has to be recovered from the decoded
 * path rather than matched against the raw URL.
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;

  let path = url.split("?")[0];
  try {
    path = decodeURIComponent(path);
  } catch {
    // Malformed escape sequence — match against the raw path instead.
  }

  const lower = path.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
