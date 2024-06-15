import Editor from "@/app/[locale]/Editor";
import Nav from "@/components/Nav";
import Tooltips from "@/components/Tooltips";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";

export default function Home() {
    return (
        <main className="m-0 p-0">
            <Nav />
            <section
                className="p-4 mt-[68px] flex gap-4 print:p-0 print:m-0"
            >
                <LeftBar />
                <article className="bg-dark1 rounded-lg p-2 print:p-0 flex-grow flex flex-col items-center">
                    <Tooltips />
                    <Editor />
                </article>
                <RightBar />
            </section>
        </main>
    );
}
