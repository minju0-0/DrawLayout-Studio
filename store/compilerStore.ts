import { create } from "zustand";

export type CodeTab = "html" | "react" | "vue";

export type CompilerState = {
  activeTab: CodeTab;
  generatedCode: string;
  isCompiling: boolean;
  compileError: string;
  compileWarning: string;
  setActiveTab: (tab: CodeTab) => void;
  setGeneratedCode: (code: string) => void;
  setIsCompiling: (value: boolean) => void;
  setCompileError: (error: string) => void;
  setCompileWarning: (warning: string) => void;
};

export const useCompilerStore = create<CompilerState>((set) => ({
  activeTab: "html",
  generatedCode: "",
  isCompiling: false,
  compileError: "",
  compileWarning: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setIsCompiling: (value) => set({ isCompiling: value }),
  setCompileError: (error) => set({ compileError: error }),
  setCompileWarning: (warning) => set({ compileWarning: warning }),
}));
