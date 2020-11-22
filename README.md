# LionRTC
🦁 Project 3 of CSC 360 at TCNJ 

## Installation

Be sure to install the [latest LTS](https://nodejs.org/en/) of Node.js on your computer. Once installed, you'll have `npm` installed. To check if you have successfully installed, run:

```bash
$ node --v
```

and to check `npm`

```bash
$ npm --v
```



## Usage

This repository has the node modules and dependencies requires to run the program. To run this project:

```bash
$ npm run devStart
```

This lets you run the program without constantly refreshing and rerunning the program on your terminal

In addition, you need to run the `peers` program for the P2P connection of the RTC. **Open a new terminal window and run the following:**

```js
peerjs --port 3001
```

Now, open your browser and enter `localhost:3000 `

Notice how the slug is a randomly generated room id. You can, of course, create your own slug would have a unique room. To test for multiple connections and compatibility, open another browser and copy the complete URL from the first browser. This let's the second client connect to one room. You should see two video boxes of yourself. 



## Collaboration and Contribution

From experience, this project is very easy to break. Therefore, having git branches where each individual works on and then creates a pull request for code review is ideal. Please check out the following guides and tutorials on doing that. **Do not push semi working code on the master branch**. Please create a separate branch instead.

To create your own branch locally

```bash
$ git checkout -b <name-the-branch-here>
```

To push the local branch to GitHub:

```bash
$ git add .
```

```bash
$ git commit -m "<ADD COMMIT MESSAGE>"
```

```bash
$ git push -u origin <branch name>
```

Create a Pull from there:

1. Click on the [Pull Requests](https://github.com/abhivemp/LionRTC/pulls) Tab 
2. Click on New pull request
3. Change the **compare** branch (the ride side) to the recently pushed branch
4. Type in any necessary info and hit submit

### The issues tab for tasks

If you guys want, not necessary, add bugs and tasks on the [Repo's issue](https://github.com/abhivemp/LionRTC/issues) tab. I think it's a great layout and can help divide work up during the break.

## Caution

I recommend you run the terminal with admin privileges. In Win10, I had to explicitly do that despite being an admin user. 