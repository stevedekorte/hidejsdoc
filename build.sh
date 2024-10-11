#!/bin/bash

# Enable command echoing
set -x

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting build process for Hide JSDoc extension..."

# Print current directory
pwd

# Print Node.js and npm versions
node --version
npm --version

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found. Please install Node.js and npm."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if vsce is installed globally, if not install it
if ! command -v vsce &> /dev/null
then
    echo "vsce is not installed globally. Installing it now..."
    npm install -g vsce
fi

# Build the extension
echo "Building the extension..."
vsce package

echo "Build process completed. The .vsix file should now be in the project root directory."