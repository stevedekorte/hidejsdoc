function AIChatHistory() {
  // ... existing code ...

  const collapseComments = (code: string) => {
    const lines = code.split('\n');
    let collapsed = '';
    let inCommentBlock = false;
    let commentBlockStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('/**') && !inCommentBlock) {
        inCommentBlock = true;
        commentBlockStart = i;
      } else if (line.endsWith('*/') && inCommentBlock) {
        inCommentBlock = false;
        if (i - commentBlockStart > 2) {
          collapsed += `${lines[commentBlockStart]}\n  ...\n${lines[i]}\n`;
        } else {
          collapsed += lines.slice(commentBlockStart, i + 1).join('\n') + '\n';
        }
      } else if (!inCommentBlock) {
        collapsed += lines[i] + '\n';
      }
    }

    return collapsed.trim();
  };

  // ... existing code ...
}