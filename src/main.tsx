import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// 개발 중 상황일 때 => build된 결과물이 아니라, vite를 통한 개발 중
// StrictMode는 엄격한 규칙을 통해서 리액트가 동작되도록 함

// 코드 상에 StrictMode로 썼더라고
// 나중에 배포 시 (프로덕션 모드) 에는 StrictMode는 무시됨

createRoot(document.getElementById("root")!).render(<App />);
