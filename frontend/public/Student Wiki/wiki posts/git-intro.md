---
title: "Git Guide"
description: "Get good with the git guide"
author: CS193 Team
date: 2021-03-26 12:00:00 -0400
categories: technical
---

## What's a VCS?

VCS stands for Version Control System. You can think about it like Google Docs, but for code. Unlike Google Docs, though, it tracks every change you make! VCS's are used to help manage multiple developers working on the same project, among their many other benefits. There are many VCS's available for you to use, but in this article we'll be focusing on Git.

## Why use a VCS?

There are many reasons to use a VCS, and here are just a few:

- With a VCS, you can avoid losing work because of a crash or deleting a file that you didn't mean to; you can revert your code back to when it was working
- Many CS classes at Purdue require knowledge of a VCS (and of these classes, most use Git)
- It's the most common way to collaborate with code
- Most companies will expect you to be able to use a VCS
- And even if you just learn Git, the skills you learn will be transferable to other VCS's you might have to use

## Git

To start using git, you must first create a repository. A repository is a folder with git functionality (it has version control now). You have to initialize git so that it'll start keeping track of everything for you. Git keeps track of things in a hidden ".git" folder within the repository folder. Git's like a program that goes in your folder and starts tracking everything you do.

![Git Repository](./images/git-guide/git_init.PNG)

This repository on your local computer will be used to track and push changes to a central repo. If you are familiar with Github, this is the central repository hosted on Github. This central repository is the place where all collaborators can push their changes to and share with others. Think of it like a folder in Google Drive, but for holding code, not documents.

On the left is our local repository stored on our computer; on the right is the central repo on Github

![Local vs Remote](./images/git-guide/git_local_vs_remote.PNG)

So how do you push the changes you made in your local repository (that lives on your own computer) to the central repository (that your collaborators can use and see)? The basic git workflow is the following:

1. Change all the files you want
2. ADD your changes
3. COMMIT the files you added
4. PUSH your commit

To clarify these terms:

- **Adding a file** means that you want git to pay attention to that file. You're adding that file to a list to be committed- during your next commit, the files you added will be included. Once you commit, all files are un-added and you must re-add them to include them in the next commit.
- **Committing** means that you want git to save your changes to the files you previously added. A commit represents all the changes to the added files- this means it includes edits, additions, and deletions of files. Once something's committed, you can always go back to that commit at any time in the future.
- **Pushing** is when you push all commits that haven't already been pushed to your central repository. Pushing is what actually updates your central repository, letting your collaborators view your changes.

## Helpful Git Commands

### git add

![Git Add](./images/git-guide/git_add.PNG)

### git commit

![Git Commit](./images/git-guide/git_commit.PNG)

### git status

![Git Status](./images/git-guide/git_status.PNG)

### git log

![Git Log](./images/git-guide/git_log.PNG)

### git diff

![Git Diff](./images/git-guide/git_diff.PNG)

### git revert

![Git Revert](./images/git-guide/git_revert.PNG)