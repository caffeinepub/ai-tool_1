import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FileText, Plus, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteLetter, useLetters } from "../hooks/useLetters";
import { LETTER_TYPE_LABELS, LetterType } from "../types/letter";
import type { LocalLetter } from "../types/letter";

interface LeftPanelProps {
  selectedId: string | null;
  onSelect: (letter: LocalLetter) => void;
  onNew: () => void;
}

export function LeftPanel({ selectedId, onSelect, onNew }: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: letters = [], isLoading } = useLetters();
  const deleteMutation = useDeleteLetter();

  const filtered = searchQuery.trim()
    ? letters.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : letters;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("पत्र हटवले गेले.");
    } catch {
      toast.error("पत्र हटवताना त्रुटी आली.");
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("mr-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getTypeBadgeColor = (type: LetterType) => {
    const map: Record<LetterType, string> = {
      [LetterType.officeLetter]:
        "bg-blue-500/15 text-blue-300 border-blue-500/20",
      [LetterType.governmentPressNote]:
        "bg-purple-500/15 text-purple-300 border-purple-500/20",
      [LetterType.application]:
        "bg-green-500/15 text-green-300 border-green-500/20",
      [LetterType.petition]:
        "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
      [LetterType.complaintLetter]:
        "bg-red-500/15 text-red-300 border-red-500/20",
      [LetterType.informationRequestLetter]:
        "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
      [LetterType.certificateOfAppreciation]:
        "bg-orange-500/15 text-orange-300 border-orange-500/20",
    };
    return map[type] ?? "bg-muted text-muted-foreground";
  };

  return (
    <div className="flex h-full flex-col border-r border-navy-border bg-navy-panel">
      <div className="border-b border-navy-border px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">माझी पत्रे</h2>
          <span className="text-xs text-muted-foreground">
            {letters.length} पत्रे
          </span>
        </div>
        <Button
          type="button"
          onClick={onNew}
          data-ocid="letters.primary_button"
          size="sm"
          className="w-full bg-brand-orange text-xs font-semibold text-white hover:bg-brand-orange-hover"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />+ नवीन पत्र
        </Button>
      </div>

      <div className="border-b border-navy-border px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="पत्र शोधा..."
            data-ocid="letters.search_input"
            className="h-7 border-navy-border bg-navy-deep pl-8 text-xs placeholder:text-muted-foreground/60 focus-visible:ring-brand-orange"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-2" data-ocid="letters.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-md bg-navy-surface"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="letters.empty_state"
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <FileText className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? "कोणतेही पत्र सापडले नाही"
                  : "अद्याप कोणतेही पत्र नाही"}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((letter, index) => (
                <motion.button
                  type="button"
                  key={letter.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.04 }}
                  data-ocid={`letters.item.${index + 1}`}
                  onClick={() => onSelect(letter)}
                  className={cn(
                    "group relative mb-1 cursor-pointer rounded-md border-l-2 px-3 py-2.5 transition-all duration-150 hover:bg-navy-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange",
                    selectedId === letter.id
                      ? "border-brand-orange bg-navy-surface"
                      : "border-transparent",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <FileText
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          selectedId === letter.id
                            ? "text-brand-orange"
                            : "text-muted-foreground",
                        )}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                          {letter.title || "शीर्षकाशिवाय पत्र"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {formatDate(letter.createdAt)}
                        </p>
                        <Badge
                          className={cn(
                            "mt-1 h-4 px-1.5 text-[9px] font-normal border",
                            getTypeBadgeColor(letter.letterType),
                          )}
                          variant="secondary"
                        >
                          {LETTER_TYPE_LABELS[letter.letterType]}
                        </Badge>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, letter.id)}
                      data-ocid={`letters.delete_button.${index + 1}`}
                      className="mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
