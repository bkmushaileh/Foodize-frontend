import BASE_URL from "@/api/baseurl";

export const getImageSource = (image?: string | number) => {
  if (typeof image === "number") return image;
  const s = String(image).trim();
  if (
    /^(https?:\/\/|file:\/\/|content:\/\/|data:image|asset:\/\/|ph:\/\/|assets-library:\/\/)/i.test(
      s
    )
  ) {
    return { uri: s };
  }
  if (s.startsWith("/") || /^(storage|mnt|sdcard|emulated)\//i.test(s)) {
    return { uri: `file://${s}` };
  }
  const origin = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const safe = s
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return { uri: `${origin}/${safe}` };
};
