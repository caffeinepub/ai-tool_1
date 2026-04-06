import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import type { LetterType } from "../backend";
import { LETTER_TYPE_LABELS } from "../types/letter";
import { generateMarathiLetter } from "../utils/aiTemplates";

interface AIGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (content: string) => void;
  letterType: LetterType;
  tone: string;
}

export function AIGenerateModal({
  open,
  onClose,
  onGenerate,
  letterType,
  tone,
}: AIGenerateModalProps) {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const content = generateMarathiLetter(letterType, subject, tone, details);
    setIsGenerating(false);
    onGenerate(content);
    onClose();
    setSubject("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="ai-generate.dialog"
        className="max-w-lg border-navy-border bg-navy-surface text-foreground shadow-navy-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-brand-orange" />
            एआय पत्र तयार करा
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              पत्र प्रकार
            </Label>
            <div className="rounded-md border border-navy-border bg-navy-deep px-3 py-2 text-sm">
              {LETTER_TYPE_LABELS[letterType]}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-subject" className="text-sm font-medium">
              विषय <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ai-subject"
              data-ocid="ai-generate.input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="उदा: रहिवासी दाखला मिळण्याबाबत..."
              className="border-navy-border bg-navy-deep text-foreground placeholder:text-muted-foreground/60 focus:border-brand-orange focus-visible:ring-brand-orange"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-details" className="text-sm font-medium">
              तपशील (ऐच्छिक)
            </Label>
            <Textarea
              id="ai-details"
              data-ocid="ai-generate.textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="पत्राबद्दल अधिक माहिती द्या..."
              rows={4}
              className="border-navy-border bg-navy-deep text-foreground placeholder:text-muted-foreground/60 focus:border-brand-orange focus-visible:ring-brand-orange resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="ai-generate.cancel_button"
            className="border-navy-border text-muted-foreground hover:bg-navy-panel hover:text-foreground"
          >
            रद्द करा
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!subject.trim() || isGenerating}
            data-ocid="ai-generate.submit_button"
            className="bg-brand-orange text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                तयार होत आहे...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                पत्र तयार करा
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
