import { useAuth } from "@/_core/hooks/useAuth";
import { RetroCard } from "@/components/RetroCard";
import { TypewriterText } from "@/components/TypewriterText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Disc, Gamepad2, Layers, Radio, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setName("");
      setSelectedFile(null);
      toast.success("Access requested successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join waitlist");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileMimeType: string | undefined;

    if (selectedFile) {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove data URL prefix (e.g., "data:image/png;base64,")
          const base64Data = base64String.split(",")[1];
          resolve(base64Data);
        };
      });
      reader.readAsDataURL(selectedFile);
      fileData = await base64Promise;
      fileName = selectedFile.name;
      fileMimeType = selectedFile.type;
    }

    joinWaitlist.mutate({
      email,
      name: name || undefined,
      fileData,
      fileName,
      fileMimeType,
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden scanlines">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/hero-void.png')] bg-cover bg-center opacity-40 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-sys-void/80 via-sys-void/50 to-sys-void z-0" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(111,232,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(111,232,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] z-0 pointer-events-none" />

      {/* Main Content */}
      <main className="container relative z-10 flex-grow flex flex-col items-center justify-center py-20">
        
        {/* Header / Logo Area */}
        <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sys-cyan/30 bg-sys-cyan/5 text-sys-cyan text-xs font-mono tracking-widest uppercase mb-4 animate-flicker">
            <span className="w-2 h-2 rounded-full bg-sys-cyan animate-pulse" />
            System Status: Initializing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-2 text-glow">
            NOSTALGIST<span className="text-sys-cyan">™</span>
          </h1>
          
          <div className="h-8 md:h-10">
            <TypewriterText 
              text="THE ARCHIVE IS LOADING..." 
              className="text-xl md:text-2xl font-mono text-sys-bone/80 tracking-widest"
              speed={50}
              delay={500}
            />
          </div>
          
          <p className="text-lg md:text-xl text-sys-bone/60 max-w-2xl mx-auto leading-relaxed font-light">
            An immersive learning system that teaches audio engineering, game design, and blockchain concepts through play, exploration, and discovery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-20">
          <RetroCard variant="amber" title="Exercise 01" className="group">
            <div className="h-40 mb-4 overflow-hidden rounded-md border border-white/5 relative">
              <img 
                src="/images/audio-tube.png" 
                alt="Vacuum Tube" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-sys-amber/10 mix-blend-overlay" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Radio className="w-5 h-5 text-sys-amber" />
              McIntosh Chamber
            </h3>
            <p className="text-sm text-sys-bone/70 leading-relaxed">
              Master the art of sonic purity. Tune frequencies, eliminate distortion, and earn the "Archivist's Ear" stamp in a virtual high-fidelity sound lab.
            </p>
          </RetroCard>

          <RetroCard variant="cyan" title="The Ledger" className="group">
            <div className="h-40 mb-4 overflow-hidden rounded-md border border-white/5 relative">
              <img 
                src="/images/archive-monolith.png" 
                alt="Digital Archive" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-sys-cyan/10 mix-blend-overlay" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sys-cyan" />
              Blockchain Literacy
            </h3>
            <p className="text-sm text-sys-bone/70 leading-relaxed">
              Experience Web3 concepts implicitly. Your progress is tracked on a "Bingo Card" ledger where every stamp is a verifiable proof of skill.
            </p>
          </RetroCard>

          <RetroCard variant="default" title="Progression" className="group">
            <div className="h-40 mb-4 overflow-hidden rounded-md border border-white/5 relative flex items-center justify-center bg-sys-void/50">
              <div className="relative w-full h-full">
                 <img 
                  src="/images/hero-void.png" 
                  alt="Retro Gaming" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-white/80" />
              Play to Learn
            </h3>
            <p className="text-sm text-sys-bone/70 leading-relaxed">
              No lectures. No tests. Just puzzles, discovery, and the thrill of figuring it out yourself. From Novice to Master, your journey is your own.
            </p>
          </RetroCard>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-md mx-auto text-center relative">
          <div className="absolute -inset-10 bg-sys-cyan/5 blur-3xl rounded-full pointer-events-none" />
          
          <RetroCard className="relative bg-sys-void/80 border-sys-cyan/20">
            {!submitted ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-mono">JOIN THE WAITLIST</h3>
                  <p className="text-sys-bone/60 text-sm">
                    Secure your spot in The Archive. Early access members receive the exclusive "Pioneer" stamp.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="NAME (OPTIONAL)..." 
                      className="bg-black/50 border-white/10 text-white placeholder:text-white/20 font-mono h-12 pl-4 focus-visible:ring-sys-cyan/50 focus-visible:border-sys-cyan/50"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="ENTER_EMAIL_ADDRESS..." 
                      className="bg-black/50 border-white/10 text-white placeholder:text-white/20 font-mono h-12 pl-4 focus-visible:ring-sys-cyan/50 focus-visible:border-sys-cyan/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* File Upload Demo */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-12 bg-black/50 border-white/10 text-white hover:bg-white/5 hover:text-sys-cyan font-mono"
                    >
                      <Upload className="mr-2 w-4 h-4" />
                      {selectedFile ? selectedFile.name : "ATTACH_FILE (OPTIONAL)"}
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={joinWaitlist.isPending}
                    className="w-full h-12 bg-sys-cyan text-sys-void font-bold tracking-wider hover:bg-sys-cyan/90 hover:shadow-[0_0_20px_rgba(111,232,255,0.4)] transition-all duration-300 disabled:opacity-50"
                  >
                    {joinWaitlist.isPending ? "PROCESSING..." : "INITIALIZE_ACCESS"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
                
                <div className="flex items-center justify-center gap-6 text-xs text-sys-bone/40 font-mono pt-2">
                  <span className="flex items-center gap-1"><Disc className="w-3 h-3" /> $NOSTA</span>
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> $DOCENT</span>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-sys-cyan/10 flex items-center justify-center mx-auto border border-sys-cyan/50 text-sys-cyan shadow-[0_0_20px_rgba(111,232,255,0.2)]">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-mono">ACCESS REQUESTED</h3>
                <p className="text-sys-bone/60">
                  Your signal has been received. Stand by for transmission.
                </p>
                <Button 
                  variant="ghost" 
                  className="text-sys-cyan hover:text-sys-cyan/80 hover:bg-sys-cyan/5"
                  onClick={() => setSubmitted(false)}
                >
                  REGISTER_ANOTHER_USER
                </Button>
              </div>
            )}
          </RetroCard>
        </div>
      </main>

      {/* Footer / Anchor Layer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/80 backdrop-blur-sm py-4 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-sys-bone/30">
          <div className="flex items-center gap-4">
            <span>NOSTALGIST_OS v1.0</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sys-neon animate-pulse" />
              SYSTEM_ONLINE
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-sys-cyan transition-colors">MANIFESTO</a>
            <a href="#" className="hover:text-sys-cyan transition-colors">PROTOCOL</a>
            <a href="#" className="hover:text-sys-cyan transition-colors">CONTACT</a>
          </div>
          <div className="md:text-right">
            © 2025 NOSTALGIST.IO
          </div>
        </div>
      </footer>
    </div>
  );
}
