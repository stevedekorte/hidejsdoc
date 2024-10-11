# Hide JSDoc

## About

A tiny extension that auto folds most JSDocs when a file is opened.
This helps to reduce visual clutter and focus on the code.
You can unfold the jsdocs to view them.

Key features:

- Auto-collapses function and method JSDoc comments
- Keeps class and module JSDoc comments at the top of the file expanded
- Helps reduce visual clutter while preserving important high-level documentation

## How to install

You have two options to install this extension:

### Option 1: Drag and Drop (Easiest)

1. Download the .vsix file from this repository.
2. Open VS Code.
3. Drag and drop the .vsix file directly into the VS Code window.
4. VS Code will prompt you to install the extension. Click "Install" to proceed.

### Option 2: Install from VSIX

1. Download the .vsix file from this repository.
2. Open VS Code and go to the Extensions view (click the square icon with four smaller squares in the left sidebar, or press Ctrl+Shift+X).
3. Click on the "..." (More Actions) button at the top of the Extensions view.
4. Select "Install from VSIX..." from the dropdown menu.
5. Navigate to and select the downloaded .vsix file.

After installation, you may need to reload VS Code for the changes to take effect.

## Notes

### Publishing

I'd like to publish this to the marketplace, but I ran into issues with Azure and don't have time to look into it further right now.

### Development

I had the idea for this extension but used Cursor.app (with Claude 3.5 Sonnet) to write and debug the code. I didn't even look at code, so I can't vouch for it. _Use at your own risk_.

### Support

If you have an issue, please open the source in Cursor (or a similar IDE) and ask it to fix it. That's all I would do anyways.

### Contributing

If you make an improvement you'd like to share, feel free to make a pull request.

### Making and testing changes

You can now use the provided shell script to automate the build process:

1. Make sure you have execute permissions on the script:

   ```
   chmod +x build.sh
   ```

2. Run the script:

   ```
   ./build.sh
   ```

This script will install dependencies, ensure vsce is installed globally, and then build the extension.

Alternatively, you can still compile a new .vsix file manually after making changes:

1. Ensure all dependencies are installed:

   ```
   npm install
   ```

2. Install vsce globally if you haven't already:

   ```
   npm install -g vsce
   ```

3. Run the build script:

   ```
   npm run build
   ```

4. The new .vsix file will be created in the project's root directory.

5. To install the new version in VS Code:
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X)
   - Click "..." at the top of the Extensions view
   - Select "Install from VSIX..."
   - Choose your newly created .vsix file

Remember to increment the version number in `package.json` if you're creating a new release version.

## Notes

### Behavior

This extension automatically collapses JSDoc comments for functions and methods when a file is opened. However, it intentionally leaves class and module JSDoc comments at the top of the file expanded. This allows you to quickly see the high-level documentation for the file while reducing clutter from individual function documentation.

### Publishing

I'd like to publish this to the marketplace, but I ran into issues with Azure and don't have time to look into it further right now.

### Development

I had the idea for this extension but used Cursor.app (with Claude 3.5 Sonnet) to write and debug the code. I didn't even look at code, so I can't vouch for it. _Use at your own risk_.

### Support

If you have an issue, please open the source in Cursor (or a similar IDE) and ask it to fix it. That's all I would do anyways.

### Contributing

If you make an improvement you'd like to share, feel free to make a pull request.

### Making and testing changes

To compile a new .vsix file after making changes:

1. Ensure all dependencies are installed:

   ```
   npm install
   ```

2. Install vsce globally if you haven't already:

   ```
   npm install -g vsce
   ```

3. Run the build script:

   ```
   npm run build
   ```

4. The new .vsix file will be created in the project's root directory.

5. To install the new version in VS Code:
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X)
   - Click "..." at the top of the Extensions view
   - Select "Install from VSIX..."
   - Choose your newly created .vsix file

Remember to increment the version number in `package.json` if you're creating a new release version.
