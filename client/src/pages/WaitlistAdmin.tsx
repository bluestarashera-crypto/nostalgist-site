import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Download, Loader2, Mail, User, FileText } from "lucide-react";
import { Link } from "wouter";

export default function WaitlistAdmin() {
  const { user, loading: authLoading } = useAuth();
  const { data: entries, isLoading } = trpc.waitlist.list.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sys-void">
        <Loader2 className="w-8 h-8 animate-spin text-sys-cyan" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sys-void">
        <Card className="max-w-md w-full bg-black/80 border-sys-cyan/20">
          <CardHeader>
            <CardTitle className="text-white font-mono">Authentication Required</CardTitle>
            <CardDescription className="text-sys-bone/60">
              You must be logged in to view the waitlist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-sys-cyan text-sys-void hover:bg-sys-cyan/90"
            >
              <a href={getLoginUrl()}>Login</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sys-void scanlines">
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white font-mono mb-2 text-glow">
              WAITLIST ADMIN
            </h1>
            <p className="text-sys-bone/60">
              Manage early access requests for The Archive
            </p>
          </div>
          <Button asChild variant="outline" className="border-sys-cyan/30 text-sys-cyan">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sys-cyan" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="bg-black/60 border-white/10 hover:border-sys-cyan/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-white font-mono flex items-center gap-2">
                        <User className="w-4 h-4 text-sys-cyan" />
                        {entry.name || "Anonymous"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sys-bone/60">
                        <Mail className="w-4 h-4" />
                        {entry.email}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-sys-bone/40 font-mono">
                        {new Date(entry.createdAt).toLocaleString()}
                      </div>
                      <div
                        className={`inline-block mt-2 px-2 py-1 rounded text-xs font-mono ${
                          entry.status === "approved"
                            ? "bg-sys-neon/10 text-sys-neon"
                            : entry.status === "rejected"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-sys-amber/10 text-sys-amber"
                        }`}
                      >
                        {entry.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {entry.attachmentUrl && (
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 bg-sys-cyan/5 rounded border border-sys-cyan/20">
                      <FileText className="w-5 h-5 text-sys-cyan" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-mono truncate">
                          {entry.attachmentFilename}
                        </div>
                        <div className="text-xs text-sys-bone/40">
                          {entry.attachmentMimeType}
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-sys-cyan text-sys-void hover:bg-sys-cyan/90"
                      >
                        <a
                          href={entry.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-black/60 border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-sys-bone/60 font-mono">
                No waitlist entries yet. Check back soon.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
