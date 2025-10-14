---
title: "Terminal Cheatsheet"
description: "Learn some important UNIX commands"
author: CS193 Team
date: 2021-03-14 12:00:00 -0400
categories: technical
---

## Basic UNIX Terminal Guide

### pwd (Print Working Directory)

**Description**
Prints path of current directory. (Think: what is the address of the folder I'm viewing?)

**Example**
```bash
pwd
```

### ls (List)

**Description**
Prints contents of current directory. (What stuff is in the current folder?)

**Tags**
- `-a` = all files (include hidden files)
- `-l` = detailed list

**Arguments**
Path to the folder you want to see the contents of (Leave blank to see current folder contents)

**Example**
```bash
ls -al
```

### cd (Change Directory)

**Description**
Move to the specified path. (I want to go somewhere, and I need to tell the terminal where.

**Arguments**
Exact path of the folder you want to move to, or just a subdirectory

**Syntax**
```bash
cd Directory
```

**Example**
```bash
cd ~/Documents
```

### rm (Remove)

**Description**
Permanently deletes a file or folder (No trash/recycling bin!)

**Tags**
- `-r` - Delete a folder and its contents
- `-f` - Stop confirmation prompt for write-protected files

**Arguments**
Path to the folder/file you want to delete

**Syntax**
```bash
rm [TAGS] Path
```

**Example**
```bash
rm -rf ~/Documents/Junk
```

### mv (Move)

**Description**
Move an existing file somewhere else. It can also be used to rename files.

**Arguments**
- The file you want to move
- The destination

**Example**
```bash
mv ~/Documents/source/file.txt ~/Documents/destination/file.txt
mv ~/old_name.txt ~/new_name.txt
```

### cp (Copy)

**Description**
Copy files or folders to a new location

**Syntax**
```bash
cp Source Destination
cp File-1 File-2 File-3 ... Destination
```

**Example**
```bash
cp ~/Documents/source/file.txt ~/Documents/destination/file.txt
cp ~/Desktop/Name.java ~/Desktop/Age.java ~/CS180/Homework_1
```

### clear

**Description**
Clear the Terminal Screen

**Example**
```bash
$ clear
```

### top

**Description**
See what programs are currently running

**Example**
```bash
top
```

### killall

**Description**
Kill all programs with the specified program_name

**Syntax**
```bash
killall Program_Name
```

**Example**
```bash
killall firefox
```

### touch

**Description**
Creates a new file in the location specified in the argument

**Arguments**
The files that are to be created

**Syntax**
```bash
touch File-1 File-2 File-3 ...
```

**Example**
```bash
touch ~/Documents/file1.txt ~/CS193/HW2/file2.txt
```

## Other Contents

### Files and Folders with Spaces

If a path includes files or folders with spaces, either use quotations marks (" ") or a backslash (\) before the space. For example:

```bash
~/"My Files"/test.txt
```

or

```bash
~/My\ Files/test.text
```

### Shortcuts

- `~` - Home Directory
- `.` - Current Directory
- `..` - Parent Directory

### Aliases

Aliases are set in `~/.bashrc`

Add a line to `~/.bashrc` that looks like: `alias <shortcut>="<command>"`

Save file, tell bash to reload: `$ source ~/.bashrc`

### Wildcards

**Description**
Used to include a group of files with smiliar characteristics.

They can be used with nearly any UNIX command.

**Example**
```bash
cp ~/Desktop/*.java ~/Documents/Project
```

This command will copy all .java files found in the Desktop directory into the Documents/Project folder.

```bash
mv ~/Desktop/file* ~/Documents
```

This command will copy all files that begin with "file" in the name into the Documents directory.

### Vim and Nano Customization

From Lecture 2, you should have learned about how Vim enables commands by typing colon ":" followed by your command. However, there are some commands you don't want to have to type every time. For example, it's pretty normal to want line numbers whenever you open a file. But having to type `:set number` every time you run Vim kinda sucks. How can we avoid this?

Your `~/.vimrc` (Vim Run Control) file controls what commands will run every time Vim is invoked. You can customize it to your heart's content.

You can disable this at any time within a file by typing `:set nonumber` within Vim, or by deleting it from your `~/.vimrc` and then re-opening Vim again.

As you can imagine, there are thousands of commands you can leverage in your `~/.vimrc` file. For a great resource on customization, read [this article](https://dougblack.io/words/a-good-vimrc.html).

A favorite quote from that article that you should definitely adhere to is:

> "Don't put any lines in your vimrc that you don't understand."

For those who are using nano, here is an article about [nano customization](https://www.nano-editor.org/dist/v2.1/nanorc.5.html). Similar to Vim, you add your commands in your `~/.nanorc` file.