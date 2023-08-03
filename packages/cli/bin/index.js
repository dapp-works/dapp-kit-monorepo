#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import download from "download-git-repo";
import fs from "fs-extra";
import pkg from "../package.json" assert { type: "json" };
import { spawn } from "child_process";

program
  .version(pkg.version)
  .description("Create and update a DappKit project.")
  .command("create")
  .description("Create a new DappKit project.")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Enter the name of your project:",
        },
        {
          type: "confirm",
          name: "autoInstall",
          message: "Install dependencies automatically?",
        },
      ])
      .then((answers) => {
        if (!answers.name) {
          console.error(chalk.red("No project name found."));
          return;
        }
        const spinner = ora("Downloading DappKit...").start();
        download("dapp-works/dapp-kit-template", `./${answers.name}`, (err) => {
          if (err) {
            spinner.fail(chalk.red("Failed to download DappKit."));
            console.error(err);
          } else {
            spinner.succeed(chalk.green("DappKit downloaded successfully."));
            const sourcePath = `./${answers.name}`;
            //cd to project folder and install dependencies
            process.chdir(sourcePath);
            if (answers.autoInstall) {
              const installSpinner = ora("Installing dependencies...").start();
              const install = spawn("pnpm", ["install"]);
              install.stderr.on("data", (data) => {
                console.error(`stderr: ${data}`);
                installSpinner.fail(chalk.red("Failed to install dependencies."));
              });
              install.stdout.on("close", (code) => {
                installSpinner.succeed(chalk.green("Dependencies installed successfully."));
              });
            }
          }
        });

        if (answers.addProjectId) {
          //write NEXT_PUBLIC_PROJECT_ID=dapp_sample to .env file
          fs.writeFile(".env", `NEXT_PUBLIC_PROJECT_ID=${answers.name}`, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
  });

program
  .version(pkg.version)
  .description("Create and update a DappKit project.")
  .command("upgrate")
  .description("Upgrate dappkit ")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "auto",
          message: "This operation will automatically overwrite all files under dappkit, are you sure you want to continue?",
        },
      ])
      .then((answers) => {
        if (!answers.auto) {
          console.log(chalk.gray("User canceled the operation."));
          return;
        }
        if (!fs.existsSync("./package.json")) {
          console.error(chalk.red("No package.json file found."));
          return;
        }
        const spinner = ora("Downloading DappKit...").start();
        download("dapp-works/dapp-kit-template", "./.temp", (err) => {
          if (err) {
            spinner.fail(chalk.red("Failed to download DappKit."));
            console.error(err);
          } else {
            spinner.succeed(chalk.green("DappKit downloaded successfully."));
            const sourcePath = "./.temp/src/dappkit";
            const destPath = `./src/dappkit`;
            const copySpinner = ora(`Copying ${sourcePath} to ${destPath}...`).start();
            fs.copy(sourcePath, destPath)
              .then(() => {
                copySpinner.succeed(chalk.green(`Copied ${sourcePath} to ${destPath} successfully.`));
                //delete temp folder
                fs.remove("./.temp", (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              })
              .catch((err) => {
                copySpinner.fail(chalk.red(`Failed to copy ${sourcePath}.`));
                console.error(err);
              });
          }
        });

        if (answers.addProjectId) {
          //write NEXT_PUBLIC_PROJECT_ID=dapp_sample to .env file
          fs.writeFile(".env", `NEXT_PUBLIC_PROJECT_ID=${answers.name}`, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
  });

program.parse(process.argv);
