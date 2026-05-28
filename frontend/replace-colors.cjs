const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "src");

const replacements = [
  // Hovers
  { pattern: /\bhover:bg-slate-100\b/g, replacement: "hover:bg-accent" },
  { pattern: /\bhover:bg-gray-100\b/g, replacement: "hover:bg-accent" },
  { pattern: /\bhover:bg-slate-50\b/g, replacement: "hover:bg-accent" },
  {
    pattern: /\bhover:text-indigo-[5679]00\b/g,
    replacement: "hover:text-primary",
  },
  {
    pattern: /\bhover:bg-indigo-[567]00\b/g,
    replacement: "hover:bg-primary/90",
  },
  { pattern: /\bhover:bg-indigo-[5]0\b/g, replacement: "hover:bg-primary/10" },
  {
    pattern: /\bhover:text-red-[56]00\b/g,
    replacement: "hover:text-destructive",
  },
  {
    pattern: /\bhover:bg-red-[56]00\b/g,
    replacement: "hover:bg-destructive/90",
  },
  { pattern: /\bhover:bg-green-[56]00\b/g, replacement: "hover:bg-success/90" },

  // Text
  { pattern: /\btext-slate-[89]00\b/g, replacement: "text-foreground" },
  { pattern: /\btext-gray-[89]00\b/g, replacement: "text-foreground" },
  {
    pattern: /\btext-slate-[34567]00\b/g,
    replacement: "text-muted-foreground",
  },
  { pattern: /\btext-gray-[4567]00\b/g, replacement: "text-muted-foreground" },

  { pattern: /\btext-indigo-[567]00\b/g, replacement: "text-primary" },

  { pattern: /\btext-red-[56]00\b/g, replacement: "text-destructive" },
  { pattern: /\btext-green-[56]00\b/g, replacement: "text-success" },
  { pattern: /\btext-yellow-[56]00\b/g, replacement: "text-warning" },
  { pattern: /\btext-amber-[56]00\b/g, replacement: "text-warning" },
  { pattern: /\btext-blue-[56]00\b/g, replacement: "text-info" },

  // Backgrounds
  { pattern: /\bbg-slate-50\b/g, replacement: "bg-background" },
  { pattern: /\bbg-gray-50\b/g, replacement: "bg-background" },

  { pattern: /\bbg-indigo-[56]00\b/g, replacement: "bg-primary" },
  { pattern: /\bbg-indigo-100\b/g, replacement: "bg-primary/10" },
  { pattern: /\bbg-indigo-50\b/g, replacement: "bg-primary/10" },

  { pattern: /\bbg-red-[56]00\b/g, replacement: "bg-destructive" },
  { pattern: /\bbg-red-100\b/g, replacement: "bg-destructive/10" },
  { pattern: /\bbg-red-50\b/g, replacement: "bg-destructive/10" },

  { pattern: /\bbg-green-[56]00\b/g, replacement: "bg-success" },
  { pattern: /\bbg-green-100\b/g, replacement: "bg-success/10" },
  { pattern: /\bbg-green-50\b/g, replacement: "bg-success/10" },

  { pattern: /\bbg-yellow-50\b/g, replacement: "bg-warning/10" },
  { pattern: /\bbg-yellow-100\b/g, replacement: "bg-warning/10" },
  { pattern: /\bbg-amber-50\b/g, replacement: "bg-warning/10" },

  { pattern: /\bbg-blue-50\b/g, replacement: "bg-info/10" },
  { pattern: /\bbg-blue-100\b/g, replacement: "bg-info/10" },

  // Borders
  { pattern: /\bborder-slate-[12]00\b/g, replacement: "border-border" },
  { pattern: /\bborder-gray-[12]00\b/g, replacement: "border-border" },

  { pattern: /\bborder-indigo-[56]00\b/g, replacement: "border-primary" },
  { pattern: /\bborder-indigo-[12]00\b/g, replacement: "border-primary/20" },

  { pattern: /\bborder-red-[56]00\b/g, replacement: "border-destructive" },
  { pattern: /\bborder-red-[12]00\b/g, replacement: "border-destructive/20" },

  { pattern: /\bborder-green-[56]00\b/g, replacement: "border-success" },
  { pattern: /\bborder-green-[12]00\b/g, replacement: "border-success/20" },

  // Focus and Rings
  {
    pattern: /\bfocus:border-indigo-[56]00\b/g,
    replacement: "focus:border-primary",
  },
  {
    pattern: /\bfocus:ring-indigo-[56]00\b/g,
    replacement: "focus:ring-primary",
  },
  {
    pattern: /\bfocus:ring-indigo-[12]00\b/g,
    replacement: "focus:ring-primary/20",
  },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  for (const { pattern, replacement } of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (
      stat.isFile() &&
      (fullPath.endsWith(".js") || fullPath.endsWith(".jsx"))
    ) {
      processFile(fullPath);
    }
  }
}

console.log("Starting color replacement...");
walkDir(directoryPath);
console.log("Finished.");
