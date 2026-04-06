import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LetterType } from "../backend";
import type { LocalLetter } from "../types/letter";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

const LS_KEY = "lekhan_mitra_letters";

function getLocalLetters(): LocalLetter[] {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? (JSON.parse(data) as LocalLetter[]) : getDefaultLetters();
  } catch {
    return getDefaultLetters();
  }
}

function saveLocalLetters(letters: LocalLetter[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(letters));
}

function getDefaultLetters(): LocalLetter[] {
  const now = Date.now();
  return [
    {
      id: "default-1",
      title: "जिल्हाधिकारी कार्यालयास अर्ज",
      content: `दिनांक: 01/04/2026

प्रति,
माननीय जिल्हाधिकारी,
पुणे जिल्हा

विषय: रहिवासी दाखला मिळण्याबाबत अर्ज

महोदय,

मी राजेश पाटील, राहणार पुणे जिल्हा, आपणाकडे नम्रपणे अर्ज करतो की मला रहिवासी दाखल्याची आवश्यकता आहे.

आपला विश्वासू,
राजेश पाटील`,
      tone: "औपचारिक",
      letterType: LetterType.application,
      fontFamily: "Noto Sans Devanagari",
      createdAt: now - 86400000,
      updatedAt: now - 86400000,
    },
    {
      id: "default-2",
      title: "शासकीय योजनेबाबत प्रेस नोट",
      content: `शासकीय प्रेस नोट

दिनांक: 02/04/2026

विषय: नवीन रोजगार योजना जाहीर

महाराष्ट्र शासनाने युवकांसाठी नवीन रोजगार योजना जाहीर केली आहे. या योजनेंतर्गत ५०,००० युवकांना प्रशिक्षण देण्यात येणार आहे.`,
      tone: "औपचारिक",
      letterType: LetterType.governmentPressNote,
      fontFamily: "Anek Devanagari",
      createdAt: now - 172800000,
      updatedAt: now - 172800000,
    },
    {
      id: "default-3",
      title: "पाण्याच्या समस्येबाबत तक्रार",
      content: `दिनांक: 03/04/2026

प्रति,
माननीय नगरपालिका अधिकारी

विषय: पाणीपुरवठा समस्या - तक्रार

आम्हाला गेल्या ३ दिवसांपासून पाणी मिळत नाही. कृपया तात्काळ उपाययोजना करावी.`,
      tone: "कठोर",
      letterType: LetterType.complaintLetter,
      fontFamily: "Hind",
      createdAt: now - 259200000,
      updatedAt: now - 259200000,
    },
  ];
}

export function useLetters() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<LocalLetter[]>({
    queryKey: [
      "letters",
      isAuthenticated ? identity?.getPrincipal().toString() : "local",
    ],
    queryFn: async () => {
      if (!isAuthenticated || !actor) return getLocalLetters();
      try {
        const letters = await actor.getAccessibleLettersSortedByType();
        return letters.map((l) => ({
          id: l.id.toString(),
          title: l.title,
          content: l.content,
          tone: l.tone,
          letterType: l.letterType,
          fontFamily: l.fontFamily,
          createdAt: Number(l.createdAt) / 1_000_000,
          updatedAt: Number(l.updatedAt) / 1_000_000,
        }));
      } catch {
        return getLocalLetters();
      }
    },
    enabled: !isFetching,
  });
}

export function useCreateLetter() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (
      letter: Omit<LocalLetter, "id" | "createdAt" | "updatedAt">,
    ) => {
      if (isAuthenticated && actor) {
        const id = await actor.createLetter({
          title: letter.title,
          content: letter.content,
          tone: letter.tone,
          letterType: letter.letterType,
          fontFamily: letter.fontFamily,
        });
        return id.toString();
      }
      const letters = getLocalLetters();
      const newLetter: LocalLetter = {
        ...letter,
        id: `local-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveLocalLetters([newLetter, ...letters]);
      return newLetter.id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["letters"] }),
  });
}

export function useUpdateLetter() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (letter: LocalLetter) => {
      const isRemote =
        isAuthenticated &&
        actor &&
        !letter.id.startsWith("local-") &&
        !letter.id.startsWith("default-");
      if (isRemote) {
        await actor!.updateLetter({
          id: BigInt(letter.id),
          title: letter.title,
          content: letter.content,
          tone: letter.tone,
          letterType: letter.letterType,
          fontFamily: letter.fontFamily,
        });
      } else {
        const letters = getLocalLetters();
        const idx = letters.findIndex((l) => l.id === letter.id);
        if (idx >= 0) letters[idx] = { ...letter, updatedAt: Date.now() };
        else letters.unshift({ ...letter, updatedAt: Date.now() });
        saveLocalLetters(letters);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["letters"] }),
  });
}

export function useDeleteLetter() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (id: string) => {
      if (
        isAuthenticated &&
        actor &&
        !id.startsWith("local-") &&
        !id.startsWith("default-")
      ) {
        await actor.deleteLetter(BigInt(id));
      } else {
        saveLocalLetters(getLocalLetters().filter((l) => l.id !== id));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["letters"] }),
  });
}
