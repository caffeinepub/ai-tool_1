import { LetterType } from "../backend";

function getTodayDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const toneGreetings: Record<string, string> = {
  औपचारिक: "महोदय/महोदया,",
  अनौपचारिक: "प्रिय मित्र/मैत्रिण,",
  संवेदनशील: "आदरणीय महोदय/महोदया,",
  कठोर: "संबंधित अधिकारी,",
  विनम्र: "सादर नमस्कार,",
};

const toneClosings: Record<string, string> = {
  औपचारिक: "आपला/आपली विश्वासू,",
  अनौपचारिक: "आपला मित्र/मैत्रिण,",
  संवेदनशील: "सादर भावपूर्ण,",
  कठोर: "सदर निर्णयाची प्रतीक्षेत,",
  विनम्र: "आपला आज्ञाधारक,",
};

export function generateMarathiLetter(
  type: LetterType,
  subject: string,
  tone: string,
  details: string,
): string {
  const date = getTodayDate();
  const greeting = toneGreetings[tone] ?? "महोदय/महोदया,";
  const closing = toneClosings[tone] ?? "आपला/आपली विश्वासू,";

  switch (type) {
    case LetterType.officeLetter:
      return generateOfficeLetter(date, subject, details, greeting, closing);
    case LetterType.governmentPressNote:
      return generatePressNote(date, subject, details);
    case LetterType.application:
      return generateApplication(date, subject, details, greeting, closing);
    case LetterType.petition:
      return generatePetition(date, subject, details, greeting, closing);
    case LetterType.complaintLetter:
      return generateComplaintLetter(date, subject, details, greeting, closing);
    case LetterType.informationRequestLetter:
      return generateInformationRequest(
        date,
        subject,
        details,
        greeting,
        closing,
      );
    case LetterType.certificateOfAppreciation:
      return generateCertificate(date, subject, details);
    default:
      return generateOfficeLetter(date, subject, details, greeting, closing);
  }
}

function generateOfficeLetter(
  date: string,
  subject: string,
  details: string,
  greeting: string,
  closing: string,
): string {
  return `क्रमांक: का/पत्र/${date}
दिनांक: ${date}

प्रति,
माननीय अधिकारी/व्यवस्थापक,
संबंधित विभाग,
[संस्था/कार्यालयाचे नाव]

विषय: ${subject}

${greeting}

उपरोक्त विषयास अनुसरून आपणास नम्रपणे कळविण्यात येते की, ${details || "सदर कार्यालयाशी संबंधित महत्त्वाच्या बाबींकरिता हे पत्र आपणाकडे सादर केले जात आहे."}

या संदर्भात खालील महत्त्वाच्या बाबी आपल्या निदर्शनास आणून देणे आवश्यक आहे:

१. सदर विषयाबाबत त्वरित निर्णय घेण्याची आवश्यकता आहे.
२. संबंधित सर्व कागदपत्रे या पत्रासोबत जोडलेली आहेत.
३. आपल्या मार्गदर्शनाखाली हे कार्य पूर्ण केले जाईल.

${closing}

नाव: _____________________
पदनाम: _____________________
दिनांक: ${date}
स्वाक्षरी: _____________________`;
}

function generatePressNote(
  date: string,
  subject: string,
  details: string,
): string {
  return `शासकीय प्रेस नोट

प्रेस नोट क्रमांक: प्र.नो./${date}
दिनांक: ${date}

विषय: ${subject}

महाराष्ट्र शासनाच्या वतीने प्रसिद्धीस देण्यात येते की,

${details || "शासनाने महत्त्वपूर्ण निर्णय घेतला असून जनतेच्या हितार्थ हे जाहीर केले जात आहे."}

या निर्णयामुळे राज्यातील नागरिकांना पुढील लाभ मिळणार आहेत:

१. सार्वजनिक सेवांमध्ये सुधारणा होणार आहे.
२. शासकीय योजनांचा लाभ अधिक व्यापकपणे मिळणार आहे.
३. नागरिकांच्या जीवनमानात सुधारणा अपेक्षित आहे.

शासनाच्या आदेशाने,

सचिव/संचालक,
[विभागाचे नाव],
महाराष्ट्र शासन

दिनांक: ${date}`;
}

function generateApplication(
  date: string,
  subject: string,
  details: string,
  greeting: string,
  closing: string,
): string {
  return `दिनांक: ${date}

प्रति,
माननीय अधिकारी/प्रमुख,
[कार्यालय/संस्थेचे नाव]

विषय: ${subject} - अर्ज

${greeting}

मी [अर्जदाराचे नाव], राहणार [पत्ता], आपणाकडे नम्रपणे अर्ज करतो/करते की,

${details || "मला उपरोक्त विषयाबाबत आपल्या कार्यालयाकडून आवश्यक ती मदत/सुविधा/परवानगी मिळावी अशी विनंती आहे."}

${closing}

अर्जदाराचे नाव: _____________________
भ्रमणध्वनी: _____________________
स्वाक्षरी: _____________________
दिनांक: ${date}`;
}

function generatePetition(
  date: string,
  subject: string,
  details: string,
  greeting: string,
  closing: string,
): string {
  return `दिनांक: ${date}

प्रति,
माननीय मंत्री/सचिव,
[विभागाचे नाव]

विषय: ${subject} - निवेदन

${greeting}

${details || "आम्हाला या विषयावर शासनाने तात्काळ लक्ष देणे आवश्यक आहे असे वाटते."}

${closing}

दिनांक: ${date}`;
}

function generateComplaintLetter(
  date: string,
  subject: string,
  details: string,
  greeting: string,
  closing: string,
): string {
  return `दिनांक: ${date}

प्रति,
माननीय अधिकारी,
[तक्रार निवारण विभाग]

विषय: ${subject} - तक्रार

${greeting}

${details || "उपरोक्त विषयाशी संबंधित समस्या त्वरित सोडवावी अशी विनंती आहे."}

${closing}

तक्रारदाराचे नाव: _____________________
भ्रमणध्वनी: _____________________
दिनांक: ${date}`;
}

function generateInformationRequest(
  date: string,
  subject: string,
  details: string,
  greeting: string,
  closing: string,
): string {
  return `दिनांक: ${date}

प्रति,
जन माहिती अधिकारी,
[कार्यालयाचे नाव]

विषय: माहितीच्या अधिकाराखाली ${subject} बाबत माहिती मागणी

${greeting}

${details || "सदर विभागाशी संबंधित आवश्यक माहिती पुरवावी ही विनंती आहे."}

${closing}

अर्जदाराचे नाव: _____________________
दिनांक: ${date}`;
}

function generateCertificate(
  date: string,
  subject: string,
  details: string,
): string {
  return `प्रशस्तिपत्र

दिनांक: ${date}

विषय: ${subject}

${details || "या संस्थेमध्ये आपल्या उत्कृष्ट कार्याद्वारे विशेष योगदान दिले आहे."}

त्यांच्या उज्ज्वल भविष्यासाठी शुभेच्छा!

स्वाक्षरी: _____________________
नाव: _____________________
दिनांक: ${date}

(शिक्का)`;
}

export function improveMarathiLetter(
  existingContent: string,
  tone: string,
): string {
  let result = existingContent;
  result = result.replace(/मी करतो\./g, "मी करीत आहे.");
  result = result.replace(/मी करते\./g, "मी करीत आहे.");

  if (
    (tone === "औपचारिक" || tone === "विनम्र") &&
    !result.includes("आपला") &&
    !result.includes("आपली")
  ) {
    result += "\n\nआपला विश्वासू,\n[नाव]";
  }

  return result;
}
