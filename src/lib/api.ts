const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || `Request failed (${res.status})`,
      res.status,
      data,
    );
  }
  return data as T;
}

export type UploadedFile = {
  url: string;
  fileName: string;
  storedName: string;
  mimeType: string;
  size: number;
  kind: string;
};

export async function uploadFile(
  file: File,
  kind: "property" | "kyc" | "avatar" | "branding" | "video",
  token: string,
): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/uploads?kind=${encodeURIComponent(kind)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || `Upload failed (${res.status})`,
      res.status,
      data,
    );
  }
  return (data as { data: UploadedFile }).data;
}

export { API_URL };
