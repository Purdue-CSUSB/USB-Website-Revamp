---
title:  "Purdue SSH Server Shortcut: Using SSH Key and Setting Up Alias"
description: "Tired of Reaching for Your Phone for Duo Mobile?"
author: Theo Park
date:   2026-03-10 00:00:00 -0400
categories: technical
---

By default, connecting to one of Purdue CS servers via SSH involves typing `ssh <username>@<machine>.cs.purdue.edu` followed by `<password>,PUSH` and authorizing on Duo Mobile.
However, there is a faster and more secure way of connecting to SSH servers.

In this post, I will show you how to generate an public-private SSH key pair in your local machine using OpenSSH, add the public key to Purdue server, and use the key pair to automatically authenticate.

1. In your local machine, use the following `ssh-keygen` command:
    ```sh
    ssh-keygen -t rsa -b 4096 -C "Theo's RSA Key for Purdue CS servers authentication"
    ```
    Explanation:

    - `-t rsa`: specifies the encryption algorithm to use.
        In this tutorial, we use RSA since it's the most widely available encryption, but if your machine supports it, I recommend using a stronger algorithm like `ed25519`. **See `man ssh-keygen` for more information.**
    - `-b 4096`: specifies the number of bits the RSA algorithm will use.
        By default, RSA uses fewer bits than 4096.
        Other algorithms like `ed25519` have a fixed number of bits, and this flag will be ignored
    - `-C "..."`: add a comment to the end of the public key
2. Follow the prompts for generating the key pair:
    ```
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/<your-username>/.ssh/id_rsa): [Press Enter]

    Enter passphrase (empty for no passphrase): [Type a passphrase]
    Enter same passphrase again: [Type passphrase again]
    ```

    Now, when you `cd ~/.ssh`, you will see two files:

    - `id_rsa`: This is your private key. **Do not share this with anyone.**
    - `id_rsa.pub`: this is your public key; you will share this with other people.

    If you want to learn more about public-key cryptography, here is the [slide from UIUC CS407](https://courses.grainger.illinois.edu/CS407/sp2026/Lecture%2014%20--%20Intro%20to%20Public-Key%20Cryptography.pdf).
    **Also, consider taking CS426: Computer Security or CS355: Cryptography if you are interested in this topic!**
3. Now we are going to copy the SSH key to the Purdue CS server with the following command:
    ```sh
    ssh-copy-id -i ~/.ssh/id_rsa.pub <PURDUE_USERNAME>@data.cs.purdue.edu
    ```
    Follow the instructions to log in to the server.
    This will copy your public RSA key to `~/.ssh/authorized_keys` in the Purdue server.

    Test by SSH-ing into any of the servers (e.g., `ssh me@data.cs.purdue.edu`).
    If the key was copied correctly, it will ask for the passphrase for the RSA key.
    ```
    *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    -                  Password-only logins have been disabled                 *
    *   Use of Duo Mobile, a hardware token, or an SSH key pair now required   -
    -   Duo Mobile: Enter your password followed by a comma followed by PUSH   *
    *  Token: Enter your password followed by a comma followed by 6-digit code -
    -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    Enter passphrase for key '/home/theopn/.ssh/id_rsa':  [Your SSH Key password and not <Purdue password,PUSH>]
    ```
4. To eliminate the need to type in a passphrase each time, we will add the keys to the `ssh-agent`.
    If you use macOS, execute the following commands.
    ```sh
    eval "$(ssh-agent -s)"
    ssh-add --apple-use-keychain ~/.ssh/id_rsa
    ```
    In short, `ssh-agent` is a daemon (background service) that automatically authenticates keys.
    For Linux, I recommend using [Keychain by Daniel Robbins](https://github.com/danielrobbins/keychain).

    **Again, `man` command (`man ssh-agent` and `man ssh-add`) is your best friend.**
5. Finally, we will add the settings and alias in `~/.ssh/config`:
    ```sh
    cat <<HI >> ~/.ssh/config
    Host data
        Hostname data.cs.purdue.edu
        User <PURDUE_USERNAME>
        IdentityFile ~/.ssh/id_rsa
        AddKeysToAgent yes
        UseKeychain yes
    HI
    ```
    I am using Bash's [Heredoc](https://en.wikipedia.org/wiki/Here_document) to generate a multi-line file.

Now you can simply execute `ssh data`, and you will be connected to the server without needing to pick your phone up or even type in a password.
Thanks to public-key cryptography (unless your laptop is physically compromised), it is a more secure option, too.

