import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileDown, FileText, Loader2, Printer, Save } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LetterType } from "../backend";
import { useCreateLetter, useUpdateLetter } from "../hooks/useLetters";
import type { LocalLetter } from "../types/letter";
import { improveMarathiLetter } from "../utils/aiTemplates";
import { exportToPDF, exportToWord, printLetter } from "../utils/exportUtils";
import { AIGenerateModal } from "./AIGenerateModal";
import { RightPanel } from "./RightPanel";
import { Toolbar } from "./Toolbar";

interface LetterEditorProps {
  letter: LocalLetter | null;
  onSaved: (id: string) => void;
}

export function LetterEditor({ letter, onSaved }: LetterEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fontFamily, setFontFamily] = useState("Noto Sans Devanagari");
  const [letterType, setLetterType] = useState<LetterType>(
    LetterType.officeLetter,
  );
  const [tone, setTone] = useState("औपचारिक");
  const [fontSize, setFontSize] = useState("16");
  const [showAIModal, setShowAIModal] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState<"pdf" | "word" | null>(null);

  const createMutation = useCreateLetter();
  const updateMutation = useUpdateLetter();

  const letterId = letter?.id;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally sync on letterId only
  useEffect(() => {
    if (letter) {
      setTitle(letter.title);
      setContent(letter.content);
      setFontFamily(letter.fontFamily || "Noto Sans Devanagari");
      setLetterType(letter.letterType);
      setTone(letter.tone || "औपचारिक");
      if (editorRef.current) editorRef.current.innerText = letter.content;
    } else {
      setTitle("");
      setContent("");
      setFontFamily("Noto Sans Devanagari");
      setLetterType(LetterType.officeLetter);
      setTone("औपचारिक");
      if (editorRef.current) editorRef.current.innerText = "";
    }
  }, [letterId]);

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) setContent(editorRef.current.innerText);
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.replace(/\s/g, "").length;

  const handleFormat = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  const handleAIGenerate = (generated: string) => {
    setContent(generated);
    if (editorRef.current) editorRef.current.innerText = generated;
    toast.success("पत्र एआयद्वारे तयार झाले!");
  };

  const handleAIImprove = async () => {
    if (!content.trim()) {
      toast.error("सुधारण्यासाठी प्रथम पत्र लिहा.");
      return;
    }
    setIsImproving(true);
    await new Promise((r) => setTimeout(r, 1200));
    const improved = improveMarathiLetter(content, tone);
    setContent(improved);
    if (editorRef.current) editorRef.current.innerText = improved;
    setIsImproving(false);
    toast.success("पत्र सुधारले गेले!");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("कृपया पत्राचे शीर्षक द्या.");
      return;
    }
    if (!content.trim()) {
      toast.error("कृपया पत्राचा मजकूर लिहा.");
      return;
    }
    setIsSaving(true);
    try {
      if (letter?.id) {
        await updateMutation.mutateAsync({
          ...letter,
          title,
          content,
          tone,
          letterType,
          fontFamily,
          updatedAt: Date.now(),
        });
        onSaved(letter.id);
        toast.success("पत्र अद्यतनित केले!");
      } else {
        const id = await createMutation.mutateAsync({
          title,
          content,
          tone,
          letterType,
          fontFamily,
        });
        onSaved(id);
        toast.success("पत्र जतन केले!");
      }
    } catch {
      toast.error("जतन करताना त्रुटी आली.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!content.trim()) {
      toast.error("पत्र रिकामे आहे.");
      return;
    }
    setIsExporting("pdf");
    try {
      await exportToPDF(content, title || "पत्र", fontFamily);
      toast.success("PDF डाउनलोड झाले!");
    } catch {
      toast.error("PDF तयार करताना त्रुटी आली.");
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = () => {
    if (!content.trim()) {
      toast.error("पत्र रिकामे आहे.");
      return;
    }
    printLetter(content, title || "पत्र", fontFamily);
  };

  const handleExportWord = async () => {
    if (!content.trim()) {
      toast.error("पत्र रिकामे आहे.");
      return;
    }
    setIsExporting("word");
    try {
      await exportToWord(content, title || "पत्र", fontFamily);
      toast.success("Word फाईल डाउनलोड झाली!");
    } catch {
      toast.error("Word फाईल तयार करताना त्रुटी आली.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar
          fontFamily={fontFamily}
          onFontChange={setFontFamily}
          letterType={letterType}
          onLetterTypeChange={setLetterType}
          onAIGenerate={() => setShowAIModal(true)}
          onAIImprove={handleAIImprove}
          isImproving={isImproving}
          onFormat={handleFormat}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />

        <div className="border-b border-navy-border bg-navy-panel px-5 py-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="पत्राचे शीर्षक..."
            data-ocid="editor.title.input"
            className="border-transparent bg-transparent text-lg font-semibold placeholder:text-muted-foreground/40 focus:border-transparent focus-visible:ring-0"
          />
        </div>

        <div className="relative flex-1 overflow-y-auto">
          {!content && (
            <div className="pointer-events-none absolute left-5 top-5 text-sm text-muted-foreground/40">
              येथे पत्र लिहायला सुरुवात करा किंवा &quot;एआय जनरेट&quot; बटण दाबा...
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            data-ocid="editor.editor"
            className="letter-editor min-h-full px-5 py-5 text-foreground"
            style={{
              fontFamily: `'${fontFamily}', 'Noto Sans Devanagari', sans-serif`,
              fontSize: `${fontSize}px`,
            }}
            spellCheck={false}
          />
        </div>

        <Separator className="bg-navy-border" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-2 bg-navy-panel px-5 py-3"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting === "pdf"}
              data-ocid="export.pdf.button"
              className="h-8 border-navy-border text-xs hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
            >
              {isExporting === "pdf" ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileDown className="mr-1.5 h-3.5 w-3.5" />
              )}
              पीडीएफ डाउनलोड
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              data-ocid="export.print.button"
              className="h-8 border-navy-border text-xs hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              प्रिंट करा
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportWord}
              disabled={isExporting === "word"}
              data-ocid="export.word.button"
              className="h-8 border-navy-border text-xs hover:border-green-400/50 hover:bg-green-500/10 hover:text-green-300"
            >
              {isExporting === "word" ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="mr-1.5 h-3.5 w-3.5" />
              )}
              वर्ड फाईल डाउनलोड
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="editor.save.button"
            className="h-8 bg-brand-orange px-4 text-xs font-semibold text-white hover:bg-brand-orange-hover"
          >
            {isSaving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            {isSaving ? "जतन होत आहे..." : "जतन करा"}
          </Button>
        </motion.div>
      </div>

      <div className="hidden w-72 shrink-0 xl:block">
        <RightPanel
          tone={tone}
          onToneChange={setTone}
          wordCount={wordCount}
          charCount={charCount}
        />
      </div>

      <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
        letterType={letterType}
        tone={tone}
      />
    </div>
  );
}
