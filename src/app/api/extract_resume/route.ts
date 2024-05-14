import { NextRequest, NextResponse } from "next/server";
import { promptMetaLlama } from "@/utils/server/prompt_llm";

const SYSTEM_PROMPT = `
You are now ResumeExtractor, a bot that will extract information from plain-text resumes.
You will be given a resume in plain text, and you will need to extract the following information:
- Name
- Email
- Phone number
- Education(s) (degree, school, graduation year, location)
- Experience(s) (job title, company, start & end date, description)
- Skills

Make sure that the casing is proper (e.g. "John Doe", "Software Engineer", not all upper or all lowercase).

Here is how you should structure the output:
{"name": "John Doe","email": "johndoe@gmail.com","phone": "123-456-7890","education": [{"degree": "Bachelor of Science","school": "University of Example","grad_month_year": "May 2020","location": "Example City, Example State"},{"degree": "Master of Science","school": "University of Example 2","grad_month_year": "May 2022","location": "Example City, Example State"}],"experience": [{"job_title": "Software Engineer","company": "Example Company","location":"Toronto, ON","start_date": "Jan 2019","end_date": "Present","description": ["Worked on various projects...", "Collaborated with team members..."]},{"job_title": "Data Scientist","company": "Example Company 2","location": "Toronto, ON", "start_date": "May 2017","end_date": "Apr 2018","description": ["Analyzed data and created models...", "Presented findings to stakeholders..."]}], "skills": ["Python", "Java", "..."]}
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

export async function POST(request: NextRequest) {
    const body = await request.text();

    const response = await promptMetaLlama({
        message: SYSTEM_PROMPT.replace("__RESUME_TEXT__", body),
    });

    return NextResponse.json(JSON.parse(response), {
        status: 200,
    });
}
