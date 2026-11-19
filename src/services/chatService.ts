import { ChatMessage } from '../types';
import { generateId } from '../utils/formatters';
import { apiRequest } from './apiClient';

function buildDemoCareerResponse(message: string, language: 'en' | 'ta'): string {
  const lower = message.toLowerCase();

  if (language === 'ta') {
    if (lower.includes('interview') || lower.includes('நேர்காணல்') || lower.includes('java') || lower.includes('spring')) {
      return `**[Demo Preview — Live Gemini AI Java Backend இணைக்கப்படும்போது முழுமையான AI பதில் கிடைக்கும்]**

இலங்கையிலிருந்து Work-From-Home தொழில்நுட்ப நேர்காணலுக்கு (Technical Interview) தயாராகும் முக்கிய குறிப்புகள்:

1. **Java & Spring Boot அடிப்படைகள்**:
   - Dependency Injection (@Autowired vs Constructor Injection) மற்றும் Spring Data JPA-இன் பயன்களைத் தெளிவாக விளக்குங்கள்.
   - REST API-இல் HTTP Status Codes (200, 201, 400, 401, 404) சரியாகப் பயன்படுத்துவதை எடுத்துக்காட்டுடன் கூறுங்கள்.

2. **மாதிரி பதில் (Sample Answer - "Tell me about your project")**:
   "நான் Sri Lanka-வில் உள்ள remote வேலை தேடுபவர்களுக்காக Smart Hire என்ற full-stack web application-ஐ React, TypeScript, Java 21 Spring Boot மற்றும் MySQL பயன்படுத்தி உருவாக்கினேன். இதில் JWT security மற்றும் Gemini AI resume analysis வசதிகளைச் சேர்த்துள்ளேன்."

3. **Remote Work தயார்நிலை**:
   - உங்கள் இணைய வசதி (Fiber/Backup 4G), Git/GitHub workflow மற்றும் நேர மேலாண்மை (GMT+5:30) திறன்களைக் குறிப்பிடுங்கள்.`;
    }

    if (lower.includes('email') || lower.includes('follow') || lower.includes('மின்னஞ்சல்')) {
      return `**[Demo Preview — Follow-up Email Template]**

**Subject:** Follow-up on My Application for [Job Title] – [Your Name]

Dear [Hiring Manager Name],

I hope you are doing well. I recently applied for the fully remote **[Job Title]** position at **[Company Name]** from Sri Lanka on [Application Date].

I remain very enthusiastic about contributing my skills in Java, Spring Boot, and React to your distributed engineering team. Please let me know if any additional portfolio samples or interview availability from Sri Lanka (GMT+5:30) would be helpful.

Thank you for your time and consideration.

Best regards,
[Your Full Name]
[LinkedIn / GitHub URL]`;
    }

    return `**[Demo Preview — Career Assistant (தமிழ்)]**

உங்கள் கேள்வி: "${message}"

இலங்கையிலிருந்து Work-From-Home வேலை வாய்ப்புகளைப் பெற 4 முக்கிய படிகள்:
1. **Verified Sri Lanka Eligibility**: வேலை அறிவிப்பில் "Worldwide" அல்லது "Sri Lanka" அனுமதி உள்ளதா என்பதை உறுதிப்படுத்தவும்.
2. **Resume Match Score**: விண்ணப்பிக்கும் முன் Resume Analyzer-இல் உங்கள் CV-ஐ job description உடன் ஒப்பிட்டு missing skills-ஐ சேர்க்கவும்.
3. **Portfolio & GitHub**: உங்கள் React + Spring Boot திட்டங்களை README மற்றும் live demo உடன் GitHub-இல் பதிவேற்றவும்.
4. **Follow-up**: விண்ணப்பித்த 7–10 நாட்களுக்குப் பிறகு மரியாதையான follow-up email அனுப்பவும்.

*(குறிப்பு: Java Spring Boot backend-ஐ Gemini API key உடன் இயக்கும்போது, உங்கள் தனிப்பட்ட கேள்விகளுக்கு நேரடி Gemini AI பதில்கள் MySQL வரலாற்றில் சேமிக்கப்படும்.)*`;
  }

  if (lower.includes('follow-up') || lower.includes('follow up') || lower.includes('email')) {
    return `**[Demo Preview — Follow-up Email Generator]**

**Subject:** Application Follow-Up: [Job Title] — [Your Name] (Sri Lanka Remote)

Hi [Hiring Manager / Recruiting Team],

I hope your week is going well. I am following up on my application for the fully remote **[Job Title]** role at **[Company Name]**, submitted on [Date].

Working remotely from Sri Lanka (GMT+5:30), I bring hands-on experience building full-stack applications with **Java 21, Spring Boot, MySQL, React, and TypeScript**, and I would welcome the chance to discuss how I can support your team.

Thank you for your consideration, and please let me know if I can share any additional code samples.

Best regards,
[Your Full Name]
[GitHub Link] | [LinkedIn Link]`;
  }

  if (lower.includes('hr') || lower.includes('behavioral') || lower.includes('remote')) {
    return `**[Demo Preview — HR & Remote Work Interview Prep]**

**Common Question:** *"Why are you interested in a fully remote role, and how do you stay productive working from Sri Lanka?"*

**Sample Answer:**
"Working remotely from Sri Lanka allows me to focus deeply on engineering delivery while collaborating smoothly across APAC and European overlap hours. In my recent projects, I established a structured daily routine using GitHub issues, clear written PR descriptions, and reliable primary fiber plus backup 4G connectivity so communication never stalls."

**3 Quick HR Tips:**
- Emphasize proactive written communication (async updates, clean documentation).
- Mention your GMT+5:30 timezone flexibility for team standups.
- Prepare 2 STAR-method examples (Situation, Task, Action, Result).`;
  }

  if (lower.includes('java') || lower.includes('technical') || lower.includes('spring') || lower.includes('react')) {
    return `**[Demo Preview — Technical Interview Questions (Java / Spring Boot / React)]**

1. **Spring Boot:** *Why is constructor-based dependency injection preferred over field @Autowired?*
   - **Key Point:** Ensures immutability (final fields), makes dependencies explicit, prevents circular dependency surprises, and simplifies unit testing with Mockito without needing Spring context reflection.
2. **Spring Security & JWT:** *How does a stateless JWT filter validate incoming requests?*
   - **Key Point:** OncePerRequestFilter extracts the Authorization: Bearer token header, verifies signature and expiration via JwtService, loads UserDetails, and populates SecurityContextHolder.
3. **MySQL & JPA:** *How do you prevent N+1 query problems in Hibernate?*
   - **Key Point:** Use JOIN FETCH queries, @EntityGraph, or DTO projections rather than triggering lazy-loading loops inside serialization.
4. **React + TypeScript:** *How do you separate API logic from UI components?*
   - **Key Point:** Encapsulate fetch calls and typed DTO interfaces in dedicated src/services/ modules and coordinate state with React hooks/context.`;
  }

  return `**[Demo Preview — Career Assistant]**

Regarding your question: *"${message}"*

Here is practical guidance tailored for Sri Lanka-based remote applicants:
- **Target Verified Listings:** Focus strictly on fully remote postings that explicitly list **Sri Lanka**, **APAC**, or **Worldwide (work from anywhere)** rather than region-locked roles.
- **Tailor Your Resume:** Match 70%+ of the core technical keywords in the job description using Smart Hire's Resume Analyzer before applying.
- **Track & Follow Up:** Log every submission in the Application Tracker with a 7-day follow-up reminder so no opportunity goes stale.

*Connect the Java 21 Spring Boot backend with your Gemini API key to receive live Google Gemini AI responses saved directly to MySQL.*`;
}

export const chatService = {
  async fetchHistory(): Promise<ChatMessage[] | null> {
    try {
      return await apiRequest<ChatMessage[]>('/chat/history', { method: 'GET' });
    } catch {
      return null;
    }
  },

  async sendMessage(
    message: string,
    language: 'en' | 'ta'
  ): Promise<ChatMessage> {
    try {
      return await apiRequest<ChatMessage>('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ message, language }),
      });
    } catch {
      return {
        id: generateId('msg'),
        role: 'assistant',
        content: buildDemoCareerResponse(message, language),
        language,
        source: 'DEMO_PREVIEW',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async clearHistory(): Promise<boolean> {
    try {
      await apiRequest<void>('/chat/history', { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
