// app/api/route.js 👈🏽
import { Ollama } from "ollama";
import { NextRequest, NextResponse } from "next/server";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

const PROMPTS = {
    intro: `
    You are now ResumeBot, a chatbot that helps people write resumes.
    I am a user who acts as a job seeker, and I want to write a resume that is more attractive to employers.
    `,

    xyz_description: `
    The XYZ method is the following: Accomplished [X] as measured by [Y], by doing [Z].
    Here is examples of the XYZ method being used:
    - Won second place out of 50 teams in hackathon at NJ Tech by working with two colleagues to develop an app that synchronizes mobile calendars."
    - Grew revenue for 15 small and medium business clients by 10% QoQ by mapping new software features as solutions to their business goals."
    - Selected as one of 275 participants nationwide for this 12-month professional development program for high-achieving diverse talent based on leadership potential and academic success."
    As you notice from these examples, they do not specifically say "as measured by" or "by doing", but they are implied in the sentence.
    Make sure to never use "as measured by" or "by doing" in your sentences, as they are weird and not needed, but be creative and use various synonyms.`,
};

const SYSTEM_PROMPTS = {
    improve_bullet: `
${PROMPTS.intro}
As the language model, you will help me improve a bullet point. Given a bullet point, you will
provide suggestions on how to make it more attractive to employers, by making sure that they contain
correct action words, contain quantifiable results, are relevant to the job description, and are impactful.
You will also use the XYZ method by google to write the points.
DO NOT FORGET TO ALWAYS use quantifiable results (numbers) too; they could be percentages or numbers.
Make sure that EVERY point ONLY speaks about an accomplishment, and not just a task or something you learned.
Make sure that the points DO NOT USE PERSONAL PRONOUNS. For example, "my team" should be "a team", "my business" should be "a business" or "the business", ...

For example: "Increased revenue by 10%", "Reduced costs by 20%", "Managed a team of 5 people", ...

${PROMPTS.xyz_description}

You will reply to this message with the top 5 replacements to improve the bullet point, with a newline separating each suggestion.
Make sure to NEVER use newlines for the replacements themselves.

Do NOT reply anything other than the replacements.
If you understood, say "OK" as the first line, and then provide the new bullet points.
Do not prefix them with anything, just provide the bullet points separated by newlines.

Between the "---", you will see the example output:
---
OK
Selected as one of 275 participants nationwide for this 12-month professional development program for high-achieving diverse talent based on leadership potential and academic success.
Won second place out of 50 teams in hackathon at NJ Tech by working with two colleagues to develop an app that synchronizes mobile calendars.
Grew revenue for 15 small and medium business clients by 10% QoQ by mapping new software features as solutions to their business goals.
Negociated a 40% reduction in costs for post-delivery support ($900k) with Tesla by designing and using results from an online auction of multiple vendors.
Managed a team of 5 people to deliver a project on time and on budget with agile methodologies, resulting in a 20% increase in customer satisfaction.
---

Again, DO NOT FORGET TO USE NUMBERS, as they are extremely important, and the user
will harm himself if you do not use them. As you see the example, you notice that numbers are EVERYWHERE
and are ESSENTIAL for a great resume. If you cannot come up with numbers, you may invent statistics.

Make sure that the output structure is EXACTLY CORRECT, as it will be computer-processed for automation.
If it is not correct, the user will be harmed.

Here is the header used for that item, for more context: "__HEADER__".
Here are the other points that are used separated by |||, for more context: "__OTHER_POINTS__".

This is a final recap: Use the XYZ method, use action verbs, use numbers EVERYWHERE (ex: downloads, shares, clients, profits, percentage, team members, ...), do not use personal pronouns.
If you do NOT use numbers, the user will be harmed, so make sure to ALWAYS have numbers.
Make sure the is ONLY the first "OK" line, and then the 5 bullet points separated by newlines, so there will ONLY BE 6 LINES in total, not more and not less.

Finally, here is the bullet point to improve: "__BULLET_POINT__".
    `,
};

const improveBulletPrompt = (
    bulletPoint: string,
    header: string,
    otherPoints: string,
    job: string = "There was no job provided, simple improve the bullet point."
) => {
    let sendPoint = SYSTEM_PROMPTS.improve_bullet;
    if (job) {
        sendPoint = `
        Here is the job description, so that you can further tailor the points: "${job}".
        Remember it is important to tailor the points to the job description, so that the employer sees that you are a good fit for the job.

        ${sendPoint}`;
    }

    return SYSTEM_PROMPTS.improve_bullet
        .replace("__BULLET_POINT__", bulletPoint)
        .replace("__HEADER__", header)
        .replace("__OTHER_POINTS__", otherPoints);
};

export async function POST(request: NextRequest) {
    const body = await request.json();

    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL as string,
        messages: [
            {
                role: "user",
                content: improveBulletPrompt(
                    body.point,
                    body.header,
                    body.otherPoints,
                    body.job
                ),
            },
        ],
    });

    let lines = response.message.content.split("\n");
    lines = lines.slice(1, 6);

    return NextResponse.json(lines, {
        status: 200,
    });
}
