# मराठी पत्रलेखन AI Tool

## Current State
नवीन प्रोजेक्ट — कोणतीही विद्यमान functionality नाही.

## Requested Changes (Diff)

### Add
- **मराठी AI पत्रलेखन Tool** — विषय सांगून पत्र auto-generate करणे (demo AI mode)
- **पत्र संपादन** — user स्वतः लिहिलेले पत्र AI द्वारे सुधारण्याची सुविधा
- **पत्राचे 7+ प्रकार:**
  - कार्यालयीन पत्र
  - शासकीय प्रेस नोट
  - अर्ज
  - निवेदन
  - तक्रार पत्र
  - माहितीसाठी पत्र (RTI style)
  - प्रशस्तिपत्र / शिफारस पत्र
- **Font Selection:** Anek Devanagari, Hind, Poppins, Mangal (Noto Sans Devanagari), Khand — Google Fonts via import
- **Download सुविधा:** PDF (jsPDF/html2canvas), Print (window.print), Word (.docx via docx.js)
- **Authorization (Login/Save):** पत्रे account मध्ये save, पूर्वीची पत्रे पाहण्याची सुविधा
- **Backend:** पत्रे save/retrieve/delete करण्यासाठी Motoko canister

### Modify
काहीही modify करायचे नाही — नवीन प्रोजेक्ट.

### Remove
काहीही नाही.

## Implementation Plan
1. Motoko backend: Letter type definition, CRUD operations (createLetter, getLetters, updateLetter, deleteLetter), authorization integration
2. Frontend: 
   - Landing/Home page with app intro
   - Letter Composer: letter type selector, font selector, subject/details input form
   - AI Generate mode: submit topic → demo AI generates full letter
   - AI Edit mode: paste existing letter → AI suggests improvements
   - Rich text editor area for letter content (contentEditable or textarea with formatting)
   - Download buttons: PDF, Print, Word
   - Saved Letters page: list of user's saved letters with open/edit/delete
   - Login/Logout via authorization component
3. Demo AI: template-based letter generation for each letter type in Marathi
4. Google Fonts: dynamic import for all specified font families
