import './App.css'
import {useState} from "react";
import {Button} from "./components/components.ts";
import ReviewSuggestions from "./pages/reviewSuggestions.tsx";
import InputSuggestion from "./pages/inputSuggestion.tsx";
import ShowSuggestions from "./pages/showSuggestions.tsx";

type Page = "show" | "input" | "review";

function App() {
    const [page, setPage] = useState<Page>("show");

    return (
        <>
            <div className="head">
                <Button text="主页" className={page === "show" ? "highlight" : ""} click={() => setPage("show")}/>
                <Button text="提交建议" className={page === "input" ? "highlight" : ""} click={() => setPage("input")}/>
                <Button text="审核建议" className={page === "review" ? "highlight" : ""}
                        click={() => setPage("review")}/>
            </div>
            <main className="main">
                <div className={page === "show" ? "" : "hide"}>
                    <ShowSuggestions/>
                </div>

                <div className={page === "input" ? "" : "hide"}>
                    <InputSuggestion/>
                </div>

                <div className={page === "review" ? "" : "hide"}>
                    <ReviewSuggestions/>
                </div>
            </main>
            <div
                className="foot"
                style={{
                    marginTop: "2rem",
                    padding: "1rem 0",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    opacity: 0.7
                }}
            >
                <a
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                >
                    陕ICP备2025079968号
                </a>
            </div>
        </>
    );
}


export default App
