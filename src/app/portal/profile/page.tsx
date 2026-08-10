"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store";
import { type PortalKycDoc } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { ApiError, uploadFile } from "@/lib/api";
import { cn } from "@/lib/utils";

const KYC_TYPES: PortalKycDoc["type"][] = [
  "Aadhaar",
  "PAN",
  "RERA",
  "Title Deed",
  "Tax Receipt",
  "Bank Proof",
  "Agency License",
  "Other",
];

function kycStatusVariant(status: PortalKycDoc["status"]) {
  if (status === "Verified") return "verified" as const;
  if (status === "Rejected") return "default" as const;
  return "secondary" as const;
}

function isImageFile(nameOrUrl: string, mime?: string) {
  if (mime?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(nameOrUrl);
}

function isPdfFile(nameOrUrl: string, mime?: string) {
  if (mime === "application/pdf") return true;
  return /\.pdf$/i.test(nameOrUrl);
}

export default function PortalProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [kycDocuments, setKycDocuments] = useState<PortalKycDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [kycForm, setKycForm] = useState({
    type: "Aadhaar" as PortalKycDoc["type"],
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!kycForm.file) return null;
    return URL.createObjectURL(kycForm.file);
  }, [kycForm.file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([portalApi.profile(token), portalApi.kyc(token)])
      .then(([profileRes, kycRes]) => {
        if (cancelled) return;
        const p = profileRes.data;
        setForm({
          name: p.name ?? "",
          email: p.email ?? "",
          phone: p.phone ?? "",
        });
        setKycDocuments(kycRes.data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Could not load profile");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setSaving(true);
    try {
      const res = await portalApi.updateProfile(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        token,
      );
      updateUser({
        name: res.data.name ?? form.name.trim(),
        email: res.data.email ?? form.email.trim(),
        phone: res.data.phone ?? form.phone.trim(),
        ...(res.data.avatar ? { avatar: res.data.avatar } : {}),
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const clearSelectedFile = () => {
    setKycForm((f) => ({ ...f, file: null }));
  };

  const onUploadKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycForm.file) {
      toast.error("Choose a file to upload");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadFile(kycForm.file, "kyc", token);
      const res = await portalApi.uploadKyc(
        {
          type: kycForm.type,
          fileName: uploaded.fileName,
          fileUrl: uploaded.url,
        },
        token,
      );
      setKycDocuments((prev) => [res.data, ...prev]);
      setKycForm({ type: "Aadhaar", file: null });
      toast.success("Document submitted for review");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Profile</h1>
        <p className="mt-1 text-sm text-muted">
          Your {user?.role ?? "partner"} account details shown to Growra staff.
        </p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
          <CardDescription>
            Role is fixed after signup ({user?.role}). Contact admin to change it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading profile…
            </div>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user?.role ?? ""} disabled className="capitalize opacity-80" />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save profile
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">KYC Documents</CardTitle>
          <CardDescription>
            Upload identity and property documents for Growra verification (PDF or image).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading documents…
            </div>
          ) : kycDocuments.length === 0 ? (
            <p className="text-sm text-muted">No documents uploaded yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {kycDocuments.map((doc) => {
                const url = doc.fileUrl;
                const image = url ? isImageFile(url) || isImageFile(doc.fileName) : false;
                const pdf = url ? isPdfFile(url) || isPdfFile(doc.fileName) : false;
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "overflow-hidden rounded-[8px] border border-border/80 bg-white shadow-sm",
                      doc.status === "Rejected" && "border-red-200 bg-red-50/40",
                    )}
                  >
                    <div className="relative aspect-[4/3] bg-cream/60">
                      {image && url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={doc.fileName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                          <FileText className="h-10 w-10 text-gold" />
                          <p className="line-clamp-2 text-xs text-muted">{doc.fileName}</p>
                          {pdf ? (
                            <span className="rounded-[8px] bg-white px-2 py-0.5 text-[10px] font-semibold text-charcoal">
                              PDF
                            </span>
                          ) : null}
                        </div>
                      )}
                      <span className="absolute top-2 right-2">
                        <Badge variant={kycStatusVariant(doc.status)} className="text-[10px]">
                          {doc.status}
                        </Badge>
                      </span>
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="text-sm font-semibold text-charcoal">{doc.type}</p>
                      <p className="truncate text-xs text-muted">{doc.fileName}</p>
                      <p className="text-[11px] text-muted">Uploaded {doc.uploadedAt}</p>
                      {doc.note ? (
                        <p className="rounded-[8px] bg-red-50 px-2 py-1.5 text-xs text-red-700">
                          {doc.note}
                        </p>
                      ) : null}
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gold-rich hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open file
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={onUploadKyc} className="space-y-4 border-t border-border/70 pt-4">
            <p className="text-sm font-medium text-charcoal">Upload new document</p>
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Document type</Label>
                  <select
                    value={kycForm.type}
                    onChange={(e) =>
                      setKycForm((f) => ({ ...f, type: e.target.value as PortalKycDoc["type"] }))
                    }
                    className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                  >
                    {KYC_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File</Label>
                  <Input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setKycForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
                    }
                  />
                  {kycForm.file ? (
                    <div className="flex items-center justify-between gap-2 text-xs text-muted">
                      <span className="truncate">{kycForm.file.name}</span>
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="inline-flex items-center gap-1 font-medium text-danger hover:underline"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </button>
                    </div>
                  ) : null}
                </div>
                <Button type="submit" disabled={uploading || !kycForm.file}>
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Submit for review
                </Button>
              </div>

              <div className="overflow-hidden rounded-[8px] border border-dashed border-border bg-cream/40">
                {kycForm.file && previewUrl ? (
                  isImageFile(kycForm.file.name, kycForm.file.type) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 p-4 text-center">
                      <FileText className="h-10 w-10 text-gold" />
                      <p className="text-xs font-medium text-charcoal">PDF selected</p>
                      <p className="line-clamp-2 text-[11px] text-muted">{kycForm.file.name}</p>
                    </div>
                  )
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 p-4 text-center">
                    <Upload className="h-6 w-6 text-muted" />
                    <p className="text-xs text-muted">Preview appears here</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
