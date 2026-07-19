git rm --cached .env

echo ".env" >> .gitignore

git add .

git commit -m "Remove tracked secrets"
