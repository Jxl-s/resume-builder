import Editor from "@/app/[locale]/Editor";
import Nav from "@/components/Nav";
import Tooltips from "@/components/Tooltips";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";

export default function Home() {
    const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL === "true";

    return (
        <main className="m-0 p-0">
            <Nav />
            <section className="p-4 mt-[68px] flex gap-4 print:p-0 print:m-0">
                <LeftBar />
                <article className="bg-dark1 rounded-lg p-2 print:p-0 flex-grow flex flex-col items-center">
                    <Tooltips />
                    <Editor />
                </article>
                <RightBar />
            </section>
            {!isLocal && <div className="fixed bottom-2 left-2 animate-pulse print:hidden">
                <div className="bg-danger text-white text-3xl p-4 rounded-md">
                    This is a <b>demo</b> version, run the project{" "}
                    <b>locally</b> for the full feature set.
                </div>
                <div className="bg-primary text-white text-3xl p-4 rounded-md mt-2">
                    Click{" "}
                    <a
                        href="https://github.com/Jxl-s/resume-builder"
                        target="_blank"
                        className="underline font-bold"
                    >
                        here
                    </a>{" "}
                    for the source code and more instructions.
                </div>
            </div>}
        </main>
    );
}
