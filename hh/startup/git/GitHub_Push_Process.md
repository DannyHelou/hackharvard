
# How to Push New Changes to GitHub Repository

Follow these steps to push new files or changes to your GitHub repository.

## Step 1: Open the Terminal/Command Prompt
Navigate to the folder where your GitHub repository is located.

For example:
```bash
cd path/to/your/repository
```

## Step 2: Check the Current Branch
Before making any changes, ensure you're on the correct branch. Run:
```bash
git branch
```
If you're not on the desired branch, switch to it using:
```bash
git checkout branch-name
```

## Step 3: Stage Changes
Stage the files that you want to commit by running:
```bash
git add .
```
This stages all modified and new files. You can also stage specific files by running:
```bash
git add file_name
```

## Step 4: Commit the Changes
Once the changes are staged, commit them with a message describing the changes:
```bash
git commit -m "Your commit message"
```

## Step 5: Push the Changes to GitHub
To push the changes to the remote repository, run:
```bash
git push origin branch-name
```
If you're on the `main` branch, it will be:
```bash
git push origin main
```

## Step 6: Verify Your Changes
Head over to your repository on GitHub and confirm that the changes have been successfully pushed.

## Troubleshooting

### 1. **Author Identity Unknown**
If you encounter an error asking to set your user identity, run the following commands:

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### 2. **Branch Does Not Exist**
If you see an error saying `refspec main does not match any`, ensure you're on the correct branch:
```bash
git branch
```
If the branch doesn’t exist, create it:
```bash
git checkout -b main
```

### 3. **Setting the Upstream Branch**
If you're pushing a branch for the first time, you may need to set the upstream branch:
```bash
git push --set-upstream origin branch-name
```

---

## Additional Git Commands

- **Check Git status**:
  ```bash
  git status
  ```

- **View commit history**:
  ```bash
  git log
  ```

- **Pull updates from the remote repository**:
  ```bash
  git pull origin branch-name
  ```

---

This guide should help you with pushing changes to your GitHub repository.
