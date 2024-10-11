// HideJSDoc Extension
//
// This extension automatically folds JSDoc comment blocks in JavaScript and TypeScript files.
//
// Behaviors:
// 1. Automatically folds all JSDoc comment blocks (/** ... */) when a JS/TS file is opened.
// 2. Folds JSDoc blocks when switching between open JS/TS files.
// 3. Remembers which JSDoc blocks were manually expanded by the user within a session.
// 4. Respects manually expanded blocks when switching between open files.
// 5. Resets the memory of expanded blocks when a file's tab is closed.
// 6. Provides a command "Fold JSDoc Comments" to manually trigger folding.
//
// Note: This extension only affects JSDoc-style comment blocks (/** ... */) and
// does not modify other types of comments or code structures.

import * as vscode from "vscode";

// Store expanded JSDoc ranges for each document
const expandedJSDocRanges = new Map<string, vscode.Range[]>();

export function activate(context: vscode.ExtensionContext) {
  console.log("JSDoc Folder extension is now active");

  // Register our custom folding range provider
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      [{ language: "javascript" }, { language: "typescript" }],
      new JSDocFoldingRangeProvider()
    )
  );

  let disposable = vscode.commands.registerCommand(
    "extension.foldJSDocs",
    () => {
      console.log("Fold JSDoc command executed");
      foldJSDocs();
    }
  );
  context.subscriptions.push(disposable);

  // Fold JSDoc comments when a text document is opened
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      console.log(`Document opened: ${document.fileName}`);
      if (isJavaScriptOrTypeScript(document)) {
        setTimeout(() => foldJSDocs(), 100); // Small delay to ensure the document is fully loaded
      }
    })
  );

  // Fold JSDoc comments when the active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && isJavaScriptOrTypeScript(editor.document)) {
        console.log(`Active editor changed: ${editor.document.fileName}`);
        setTimeout(() => foldJSDocs(), 100); // Small delay to ensure the editor is ready
      }
    })
  );

  // Track folding changes
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorVisibleRanges(
      (event: vscode.TextEditorVisibleRangesChangeEvent) => {
        if (isJavaScriptOrTypeScript(event.textEditor.document)) {
          updateExpandedJSDocRanges(event.textEditor);
        }
      }
    )
  );

  // Reset expanded ranges when a text document is closed
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      console.log(`Document closed: ${document.fileName}`);
      expandedJSDocRanges.delete(document.uri.toString());
    })
  );

  // Immediately try to fold JSDoc comments in the active editor
  if (
    vscode.window.activeTextEditor &&
    isJavaScriptOrTypeScript(vscode.window.activeTextEditor.document)
  ) {
    foldJSDocs();
  }

  // Add this new interval to continuously unfold classes
  const unfoldClassesInterval = setInterval(unfoldClasses, 1000); // Check every second

  // Add this to the context subscriptions to ensure it's cleared on deactivation
  context.subscriptions.push({
    dispose: () => clearInterval(unfoldClassesInterval),
  });
}

class JSDocFoldingRangeProvider implements vscode.FoldingRangeProvider {
  provideFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken
  ): vscode.FoldingRange[] {
    const jsDocRanges = findJSDocRanges(document);
    return jsDocRanges
      .filter((range) => !isClassOrModuleJSDoc(document, range))
      .map(
        (range) => new vscode.FoldingRange(range.start.line, range.end.line)
      );
  }
}

function isJavaScriptOrTypeScript(document: vscode.TextDocument): boolean {
  return (
    document.languageId === "javascript" || document.languageId === "typescript"
  );
}

function updateExpandedJSDocRanges(editor: vscode.TextEditor) {
  const document = editor.document;
  const visibleRanges = editor.visibleRanges;
  const jsDocRanges = findJSDocRanges(document);
  const expandedRanges = jsDocRanges.filter((range) =>
    visibleRanges.some((visibleRange) => visibleRange.intersection(range))
  );
  expandedJSDocRanges.set(document.uri.toString(), expandedRanges);
}

function findJSDocRanges(document: vscode.TextDocument): vscode.Range[] {
  const jsDocRanges: vscode.Range[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);

    if (line.text.trim() === "/**") {
      let endLine = i;
      while (
        endLine < document.lineCount &&
        !document.lineAt(endLine).text.trim().endsWith("*/")
      ) {
        endLine++;
      }
      if (
        endLine > i &&
        endLine < document.lineCount &&
        document.lineAt(endLine).text.trim().endsWith("*/")
      ) {
        jsDocRanges.push(
          new vscode.Range(i, 0, endLine, document.lineAt(endLine).text.length)
        );
      }
    }
  }

  return jsDocRanges;
}

async function unfoldClasses() {
  const editor = vscode.window.activeTextEditor;
  if (editor && isJavaScriptOrTypeScript(editor.document)) {
    const classRanges = findClassRanges(editor.document);
    if (classRanges.length > 0) {
      await vscode.commands.executeCommand("editor.unfold", {
        selectionLines: classRanges.map((range) => range.start.line),
      });
    }
  }
}

async function foldJSDocs() {
  console.log("Attempting to fold JSDoc comments");
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    console.log("No active editor");
    return;
  }

  const document = editor.document;
  console.log(`Active document: ${document.fileName}`);

  // First, unfold everything
  await vscode.commands.executeCommand("editor.unfoldAll");

  const jsDocRanges = findJSDocRanges(document);
  const expandedRanges = expandedJSDocRanges.get(document.uri.toString()) || [];

  const rangesToFold = jsDocRanges.filter(
    (range) =>
      !expandedRanges.some((expandedRange) => expandedRange.isEqual(range)) &&
      !isClassOrModuleJSDoc(document, range)
  );

  console.log(`Found ${rangesToFold.length} JSDoc comments to fold`);

  if (rangesToFold.length > 0) {
    await vscode.commands.executeCommand("editor.fold", {
      selectionLines: rangesToFold.map((range) => range.start.line),
    });
    console.log("Folding command executed");
  }
}

function isClassOrModuleJSDoc(
  document: vscode.TextDocument,
  range: vscode.Range
): boolean {
  const nextLineIndex = range.end.line + 1;
  if (nextLineIndex < document.lineCount) {
    const nextLine = document.lineAt(nextLineIndex).text.trim();
    return (
      nextLine.startsWith("class") ||
      nextLine.startsWith("export") ||
      nextLine.startsWith("module.exports")
    );
  }
  return false;
}

function findClassRanges(document: vscode.TextDocument): vscode.Range[] {
  const classRanges: vscode.Range[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    if (line.text.trim().startsWith("class ")) {
      let endLine = i;
      let braceCount = 0;
      let foundOpeningBrace = false;

      while (endLine < document.lineCount) {
        const currentLine = document.lineAt(endLine).text;
        if (!foundOpeningBrace && currentLine.includes("{")) {
          foundOpeningBrace = true;
        }
        braceCount += (currentLine.match(/{/g) || []).length;
        braceCount -= (currentLine.match(/}/g) || []).length;
        if (foundOpeningBrace && braceCount === 0) {
          break;
        }
        endLine++;
      }

      if (endLine > i) {
        classRanges.push(
          new vscode.Range(i, 0, endLine, document.lineAt(endLine).text.length)
        );
      }
    }
  }

  return classRanges;
}

export function deactivate() {
  console.log("JSDoc Folder extension is now deactivated");
}
