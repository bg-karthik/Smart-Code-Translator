// Supported Languages
export const LANGUAGES = Object.freeze([
  { id: "c", name: "C", extension: ".c" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "csharp", name: "C#", extension: ".cs" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "python", name: "Python", extension: ".py" },
]);

// Monaco Editor Mapping
export const MONACO_LANGUAGE_MAP = Object.freeze({
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  java: "java",
  python: "python",
});

// Starter Code Templates
export const STARTER_CODE = Object.freeze({
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  python: `print("Hello, World!")`,
});

// 🔹 Helper: get full language object
export const getLanguage = (id) => {
  return LANGUAGES.find((l) => l.id === id) || null;
};

// 🔹 Helper: get display name
export const getLanguageName = (id) => {
  return getLanguage(id)?.name || id;
};

// 🔹 Helper: get file extension
export const getLanguageExtension = (id) => {
  return getLanguage(id)?.extension || "";
};