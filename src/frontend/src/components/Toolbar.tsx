import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Loader2,
  Sparkles,
  Underline,
  WandSparkles,
} from "lucide-react";
import type { LetterType } from "../backend";
import { FONT_OPTIONS, LETTER_TYPE_LABELS } from "../types/letter";

interface ToolbarProps {
  fontFamily: string;
  onFontChange: (font: string) => void;
  letterType: LetterType;
  onLetterTypeChange: (type: LetterType) => void;
  onAIGenerate: () => void;
  onAIImprove: () => void;
  isImproving: boolean;
  onFormat: (cmd: string) => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
}

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28"];

export function Toolbar({
  fontFamily,
  onFontChange,
  letterType,
  onLetterTypeChange,
  onAIGenerate,
  onAIImprove,
  isImproving,
  onFormat,
  fontSize,
  onFontSizeChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-navy-border bg-navy-panel px-3 py-2">
      <Select value={fontFamily} onValueChange={onFontChange}>
        <SelectTrigger
          data-ocid="editor.select"
          className="h-8 w-44 border-navy-border bg-navy-deep text-xs focus:ring-brand-orange"
        >
          <SelectValue placeholder="फॉन्ट निवडा" />
        </SelectTrigger>
        <SelectContent className="border-navy-border bg-navy-surface z-50">
          {FONT_OPTIONS.map((f) => (
            <SelectItem
              key={f.value}
              value={f.value}
              className="text-xs hover:bg-navy-panel focus:bg-navy-panel"
              style={{ fontFamily: f.value }}
            >
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={letterType}
        onValueChange={(v) => onLetterTypeChange(v as LetterType)}
      >
        <SelectTrigger
          data-ocid="editor.letter_type.select"
          className="h-8 w-44 border-navy-border bg-navy-deep text-xs focus:ring-brand-orange"
        >
          <SelectValue placeholder="पत्र प्रकार" />
        </SelectTrigger>
        <SelectContent className="border-navy-border bg-navy-surface z-50">
          {Object.entries(LETTER_TYPE_LABELS).map(([value, label]) => (
            <SelectItem
              key={value}
              value={value}
              className="text-xs hover:bg-navy-panel focus:bg-navy-panel"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={fontSize} onValueChange={onFontSizeChange}>
        <SelectTrigger
          data-ocid="editor.font_size.select"
          className="h-8 w-16 border-navy-border bg-navy-deep text-xs focus:ring-brand-orange"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-navy-border bg-navy-surface z-50">
          {FONT_SIZES.map((s) => (
            <SelectItem
              key={s}
              value={s}
              className="text-xs hover:bg-navy-panel focus:bg-navy-panel"
            >
              {s}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mx-1 h-6 w-px bg-navy-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat("bold")}
        data-ocid="editor.bold.button"
        className="h-8 w-8 text-muted-foreground hover:bg-navy-surface hover:text-brand-orange"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat("italic")}
        data-ocid="editor.italic.button"
        className="h-8 w-8 text-muted-foreground hover:bg-navy-surface hover:text-brand-orange"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat("underline")}
        data-ocid="editor.underline.button"
        className="h-8 w-8 text-muted-foreground hover:bg-navy-surface hover:text-brand-orange"
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>

      <div className="mx-1 h-6 w-px bg-navy-border" />

      <Button
        size="sm"
        onClick={onAIGenerate}
        data-ocid="editor.ai_generate.button"
        className="h-8 bg-brand-orange px-3 text-xs font-semibold text-white hover:bg-brand-orange-hover"
      >
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        एआय जनरेट
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onAIImprove}
        disabled={isImproving}
        data-ocid="editor.ai_improve.button"
        className="h-8 border-navy-border px-3 text-xs font-semibold hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
      >
        {isImproving ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
        )}
        एआय सुधार
      </Button>
    </div>
  );
}
