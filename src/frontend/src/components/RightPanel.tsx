import { cn } from "@/lib/utils";
import { FileText, Hash, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { AI_TIPS, TONE_OPTIONS } from "../types/letter";

interface RightPanelProps {
  tone: string;
  onToneChange: (tone: string) => void;
  wordCount: number;
  charCount: number;
}

export function RightPanel({
  tone,
  onToneChange,
  wordCount,
  charCount,
}: RightPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-l border-navy-border bg-navy-panel p-4">
      <div>
        <h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          भाषेचा स्वर
        </h3>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onToneChange(t.value)}
              data-ocid="tone.toggle"
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                tone === t.value
                  ? "border-brand-orange bg-brand-orange/15 text-brand-orange"
                  : "border-navy-border text-muted-foreground hover:border-brand-orange/50 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          आकडेवारी
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            key={`w-${wordCount}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="rounded-lg border border-navy-border bg-navy-deep p-3 text-center"
          >
            <div className="text-xl font-bold text-brand-orange">
              {wordCount}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">शब्द</div>
          </motion.div>
          <motion.div
            key={`c-${charCount}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="rounded-lg border border-navy-border bg-navy-deep p-3 text-center"
          >
            <div className="text-xl font-bold text-brand-orange">
              {charCount}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">अक्षरे</div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5" />
          एआय सूचना
        </h3>
        <div className="space-y-2">
          {AI_TIPS.map((tip, i) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-2 rounded-md border border-navy-border bg-navy-deep p-2.5"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-[9px] font-bold text-brand-orange">
                {i + 1}
              </span>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-navy-border/50 bg-gradient-to-br from-brand-orange/5 to-transparent p-3">
        <p className="text-[10px] font-semibold text-brand-orange">
          📋 पत्र रचना
        </p>
        <ul className="mt-1.5 space-y-0.5 text-[10px] text-muted-foreground">
          <li>• दिनांक व पत्ता</li>
          <li>• प्रति (To)</li>
          <li>• विषय ओळ</li>
          <li>• संबोधन</li>
          <li>• मजकूर</li>
          <li>• समापन व स्वाक्षरी</li>
        </ul>
      </div>
    </div>
  );
}
