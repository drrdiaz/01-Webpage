#!/bin/bash
cd "/Users/rodrigodiaz/Documents/(10) Claude/(02) Claude Website"

# Remove stuck lock file
rm -f .git/index.lock

# Commit and push
git add .
git commit -m "Initial commit"
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin https://github.com/drrdiaz/01-Webpage.git
git push -u origin main

echo "---"
echo "Done! Press any key to close."
read -n 1
