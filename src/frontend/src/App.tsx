import { Toaster } from "@/components/ui/sonner";
import { PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Header } from "./components/Header";
import { LeftPanel } from "./components/LeftPanel";
import { LetterEditor } from "./components/LetterEditor";
import type { LocalLetter } from "./types/letter";

export default function App() {
  const [selectedLetter, setSelectedLetter] = useState<LocalLetter | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [editorActive, setEditorActive] = useState(false);

  const handleSelectLetter = (letter: LocalLetter) => {
    setSelectedLetter(letter);
    setSelectedId(letter.id);
    setEditorActive(true);
  };

  const handleNew = () => {
    setSelectedLetter(null);
    setSelectedId(null);
    setEditorActive(true);
  };

  const handleSaved = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex min-h-0 flex-1 overflow-hidden">
        <motion.aside
          initial={false}
          animate={{ width: leftOpen ? 272 : 0, opacity: leftOpen ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden shrink-0 overflow-hidden md:block"
          style={{ minWidth: leftOpen ? 272 : 0 }}
        >
          <div className="h-full w-[272px]">
            <LeftPanel
              selectedId={selectedId}
              onSelect={handleSelectLetter}
              onNew={handleNew}
            />
          </div>
        </motion.aside>

        <button
          type="button"
          onClick={() => setLeftOpen((o) => !o)}
          data-ocid="panel.toggle"
          className="hidden items-center justify-center border-r border-navy-border bg-navy-panel px-1 hover:bg-navy-surface md:flex"
          title={leftOpen ? "प्यानल बंद करा" : "प्यानल उघडा"}
        >
          <span className="block h-5 w-0.5 rounded-full bg-muted-foreground" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-navy-border bg-navy-panel px-4 py-2 md:hidden">
            <button
              type="button"
              onClick={handleNew}
              className="rounded border border-brand-orange px-2 py-1 text-[10px] font-medium text-brand-orange"
            >
              + नवीन
            </button>
            <span className="text-xs text-muted-foreground">लेखन मित्र</span>
          </div>

          <motion.div
            key={editorActive ? (selectedId ?? "new") : "welcome"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[oklch(0.155_0.015_240)]"
          >
            {!editorActive ? (
              <WelcomeScreen onNew={handleNew} />
            ) : (
              <LetterEditor letter={selectedLetter} onSaved={handleSaved} />
            )}
          </motion.div>
        </div>
      </main>

      <footer className="flex shrink-0 items-center justify-between border-t border-navy-border bg-navy-deep px-5 py-2.5 text-[11px] text-muted-foreground">
        <span>© {new Date().getFullYear()} लेखन मित्र — मराठी पत्रलेखन साधन</span>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-brand-orange"
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "border-navy-border bg-navy-surface text-foreground",
          },
        }}
      />
    </div>
  );
}

function WelcomeScreen({ onNew }: { onNew: () => void }) {
  const items = [
    { icon: "📄", title: "कार्यालयीन पत्र", desc: "अधिकृत कार्यालयीन पत्रव्यवहार" },
    { icon: "📰", title: "प्रेस नोट", desc: "शासकीय प्रसिद्धी पत्रक" },
    { icon: "📝", title: "अर्ज", desc: "नोकरी, परवानगी, सुविधा" },
    { icon: "📋", title: "निवेदन", desc: "सामूहिक मागण्या" },
    { icon: "⚠️", title: "तक्रार", desc: "समस्या निवारणासाठी" },
    { icon: "🏆", title: "प्रशस्तिपत्र", desc: "सन्मान व पुरस्कार" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-8 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-orange">
        <PenLine className="h-10 w-10 text-brand-orange" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">लेखन मित्रमध्ये स्वागत!</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          मराठी पत्रलेखनासाठी आपले एआय सहाय्यक. डावीकडे पत्र निवडा किंवा नवीन पत्र लिहा.
        </p>
      </div>
      <button
        type="button"
        onClick={onNew}
        data-ocid="welcome.primary_button"
        className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover"
      >
        + नवीन पत्र सुरू करा
      </button>
      <div className="mt-2 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
        {items.map((item) => (
          <button
            type="button"
            key={item.title}
            onClick={onNew}
            className="rounded-lg border border-navy-border bg-navy-panel p-3 text-left transition-colors hover:border-brand-orange/30"
          >
            <div className="text-xl">{item.icon}</div>
            <div className="mt-1.5 text-xs font-semibold">{item.title}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
