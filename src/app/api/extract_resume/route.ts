import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import fetch from "node-fetch";

const SYSTEM_PROMPT = `
You are now ResumeExtractor, a bot that will extract information from plain-text resumes.
You will be given a resume in plain text, and you will need to extract the following information:
- Name
- Email
- Phone number
- Education(s) (degree, school, graduation year, location)
- Experience(s) (job title, company, start & end date, description)
- Skills

Here is how you should structure the output:
{"name": "John Doe","email": "johndoe@gmail.com","phone": "123-456-7890","education": [{"degree": "Bachelor of Science","school": "University of Example","grad_month_year": "May 2020","location": "Example City, Example State"},{"degree": "Master of Science","school": "University of Example 2","grad_month_year": "May 2022","location": "Example City, Example State"}],"experience": [{"job_title": "Software Engineer","company": "Example Company","start_date": "Jan 2019","end_date": "Present","description": ["Worked on various projects...", "Collaborated with team members..."]},{"job_title": "Data Scientist","company": "Example Company 2","start_date": "May 2017","end_date": "Apr 2018","description": ["Analyzed data and created models...", "Presented findings to stakeholders..."]}], "skills": ["Python", "Java", "..."]}
No more, no less

In case where a date does not exist, use "Jan 2020".
If a location does not exist, use "New York, USA".

The dates use the three-letter abbreviation for the month, followed by the year, like "Jan 2024", "Apr 2022", "Jun 2022".
The dates are always "month year", and the month is always capitalized. The year is NEVER alone.

In case you cannot find the value for a field, you can use "N/A", but make sure it is properly quoted.

Please make sure to follow this structure when extracting information from the resume.
You will now reply to this message with the extracted information. Make sure that your reply contains ONLY
VALID JSON, and NOTHING ELSE.

No plain text, just the JSON Object. do not tell me anything else, just provide the JSON object.
The JSON should not have any newlines or extra spaces, and should be a single line. MAKE SURE IT IS VALID,
AND CLOSES CORRECTLY TOO. If it is not valid, the user will be harmed.

In summary: no newlines, only JSON, no extra spaces, and make sure it is valid.
The following is the resume to extract data from: __RESUME_TEXT__
`;

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });
export async function POST(request: NextRequest) {
    const response = await fetch("http://127.0.0.1:5000/prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: SYSTEM_PROMPT.replace(
                "__RESUME_TEXT__",
                `Ewen Gueguen
(438) 855-2381 • ewengue1432@gmail.com • 42 avenue des Frenes, Montreal, Quebec, H9R 0E7
EDUCATION
High School (2017-2022)
● DES at College Saint-Louis, graduated in June 2022
○ Received a prestigious Gold Medal Award for excelling and reaching the highest
math grade of the year
● International Baccalaureate (IB) Diploma at College Saint-Louis (2022)
CEGEP (2022-2024)
● DEC in Sciences at John Abbott College, graduating in June 2024
○ Recognized in the Dean’s List of Fall 2022, Winter 2023 and Fall 2023
○ R-Score of 34.3
EXPERIENCE
Data Analyst / Programmer
NDT Technologies Incorporate (2023)
● Systematically gathered and administered data obtained through a series of established
procedures
● Contributed to the rectification and engineering of specific pages on the corporate
website
Personal (2019-Present)
● Developed a fully functional 2D game which was released to the public and played by
many individuals
● Coded educational purposed projects using Java and C#
● Engineered a Bluetooth-motorized electrical vehicle using Arduino
COMPETENCE
Language
● English – Advanced
● French – Advanced
● Mandarin – Intermediate
● Cantonese – Intermediate
● Spanish – Intermediate
Skills
● Microsoft Excel
● Microsoft Word
● Java
● C#
● C++
Qualities
● Great at working under pressure
● Patient
● Hardworking
● Teamwork
● Critical Thinking
● Time Management
Campus Involvement
Club Work (2022-2024)
● Founder and Manager of the John Abbott College Badminton Club for 2 years
Volunteer Tutoring (2023-2024)
● Received a Certificate of Achievement of Tutor Training from the Academic Success
Centre
● Received Student Involvement Recognition Certificate for Volunteer tutoring at collegial
levels by volunteering over 60 hours
● Involved with over 20 hours of one-on-one Math tutoring at the John Abbott Math
Department`
            ),
        }),
    });

    const resJson = await response.json();
    return NextResponse.json(JSON.parse(resJson.message), {
        status: 200,
    });
}
