import * as vscode from "vscode";

class NoFoldingProvider implements vscode.FoldingRangeProvider {
  provideFoldingRanges(): vscode.FoldingRange[] {
    // Return an empty array to indicate no folding ranges
    return [];
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Register the no-folding provider for JavaScript and TypeScript
  const noFoldingProvider = new NoFoldingProvider();
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      [
        { scheme: "file", language: "javascript" },
        { scheme: "file", language: "typescript" },
      ],
      noFoldingProvider
    )
  );

  console.log("No-folding provider activated for JavaScript and TypeScript");

  // Optional: Command to manually unfold everything
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.unfoldEverything", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        vscode.commands.executeCommand("editor.unfoldAll");
      }
    })
  );
}

export function deactivate() {}
