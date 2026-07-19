## Hint 1

Run:

```bash
git status
```

Git will tell you which files are conflicted.

---

## Hint 2

Open `app.js`.

Git has inserted special conflict markers:

```text
<<<<<<<
=======
>>>>>>>
```

Remove these markers after deciding what the final code should look like.

---

## Hint 3

Once the file is fixed:

```bash
git add app.js

git commit
```
