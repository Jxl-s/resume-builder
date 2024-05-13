// app/api/route.js 👈🏽
import { Ollama } from "ollama";
import { NextResponse } from "next/server";

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
    - Selected as one of 275 participants nationwide for this 12-month professional development program for high-achieving diverse talent based on leadership potential and academic success."`,
};

const SYSTEM_PROMPTS = {
    improve_bullet: `
${PROMPTS.intro}
As the language model, you will help me improve a bullet point. Given a bullet point, you will
provide suggestions on how to make it more attractive to employers, by making sure that they contain
correct action words, contain quantifiable results, are relevant to the job description, and are impactful.
You will also use the XYZ method by google to write the points.
DO NOT FORGET TO ALWAYS use quantifiable results (numbers) too; they could be percentages or numbers.
For example: "Increased revenue by 10%", "Reduced costs by 20%", "Managed a team of 5 people", ...

${PROMPTS.xyz_description}

You will reply to this message with the top 5 suggestions to improve the bullet point, with a newline separating each suggestion.
Make sure to NEVER use newlines for the suggestions themselves.
Again, DO NOT FORGET TO USE NUMBERS, as they are extremely important, and the user
will harm himself if you do not use them.

Do NOT reply anything other than the suggestions.
If you understood, say "OK" as the first line, and then provide the suggestions.
Here is an example output:
OK
Accomplished accurate documentation of project milestones and design decisions, as measured by 100% compliance with client requirements, by maintaining a comprehensive project log and sharing updates with stakeholders.
Generated detailed reports on project status and design considerations, resulting in a 25% reduction in misunderstandings and rework, by utilizing a standardized documentation framework and collaborating with cross-functional teams.
Crafted clear and concise project documentation that facilitated collaboration and informed decision-making, as measured by a 90% increase in team alignment and a 15% reduction in errors, by using a structured approach to recording project activities and insights.
Maintained a detailed project log that documented progress and design choices, resulting in a 20% improvement in project transparency and stakeholder engagement, by regularly updating project documentation and sharing insights with team members.
Developed a comprehensive documentation strategy that ensured transparency and consistency throughout the project lifecycle, as measured by a 95% client satisfaction rate and a 10% increase in repeat business, by leveraging best practices in documentation and communication.

Here is the header used for that item, for more context: "__HEADER__".
Here are the other points that are used separated by |||, for more context: "__OTHER_POINTS__".
Here is the bullet point to improve: "__BULLET_POINT__".
    `,
};

const improveBulletPrompt = (
    bulletPoint: string,
    header: string,
    otherPoints: string
) => {
    return SYSTEM_PROMPTS.improve_bullet
        .replace("__BULLET_POINT__", bulletPoint)
        .replace("__HEADER__", header)
        .replace("__OTHER_POINTS__", otherPoints);
};

export async function GET() {
    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL as string,
        messages: [
            {
                role: "user",
                content: improveBulletPrompt(
                    "Developed full-stack web applications using React, Node.js, and MongoDB.",
                    "Experience,Rezoned - Full-Stack Web Developer,January 2023 - May 2023",
                    "Documented the project's progress and design choices with precision."
                ),
            },
        ],
    });

    const lines = response.message.content.split("\n");
    lines.splice(0, 1);

    return NextResponse.json(lines, {
        status: 200,
    });
}
