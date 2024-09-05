import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("JSDoc Folder extension is now active");

  let disposable = vscode.commands.registerCommand(
    "extension.foldJSDocs",
    () => {
      console.log("Fold JSDoc command executed");
      foldJSDocs();
    }
  );
  context.subscriptions.push(disposable);

  vscode.workspace.onDidOpenTextDocument((document) => {
    console.log(`Document opened: ${document.fileName}`);
    foldJSDocs();
  });

  // Immediately try to fold JSDoc comments in the active editor
  foldJSDocs();
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
  const jsDocRanges: vscode.Range[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    if (line.text.trim().startsWith("/**")) {
      let endLine = i;
      while (
        endLine < document.lineCount - 1 &&
        !document.lineAt(endLine).text.includes("*/")
      ) {
        endLine++;
      }
      if (endLine > i) {
        jsDocRanges.push(
          new vscode.Range(i, 0, endLine, document.lineAt(endLine).text.length)
        );
      }
    }
  }

  console.log(`Found ${jsDocRanges.length} JSDoc comments to fold`);

  if (jsDocRanges.length > 0) {
    await vscode.commands.executeCommand("editor.fold", {
      selectionLines: jsDocRanges.map((range) => range.start.line),
    });
    console.log("Folding command executed");
  }
}

export function deactivate() {
  console.log("JSDoc Folder extension is now deactivated");
}
