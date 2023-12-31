import inquirer from "inquirer";
//import decryptMessage from "../utils/decrypt";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import performTask from "../utils/spinner.js";
import verifyToken from "../utils/verifyToken.js";
import bcrypt from "bcryptjs";
import decryptMessage from "../utils/decrypt.js";
import userPage from "./user.js";
import colors from "colors";
export default async function seeYourPassword(loginObject) {
  try {
    const userIdList = await verifyToken(loginObject);
    const detailList = await User.findById(userIdList._id).populate(
      "userDetail"
    );
    let exampleChoice = [];

    for (let i = 0; i < Object.keys(detailList.userDetail).length; i++) {
      exampleChoice.push(detailList.userDetail[i].userId);
    }
    const passwords = await inquirer.prompt([
      {
        name: "userId",
        type: "list",
        message: "Choose your userId",
        choices: exampleChoice,
      },
      {
        name: "key",
        type: "input",
        message: "Enter your key",
      },
    ]);
    const checkingKey = await bcrypt.compare(passwords.key, userIdList.key);
    if (!checkingKey) {
      throw new Error("Key is incorrect");
    } else {
      let UserPassword;
      for (let i = 0; i < Object.keys(detailList.userDetail).length; i++) {
        if (detailList.userDetail[i].userId === passwords.userId) {
          UserPassword = detailList.userDetail[i];
          break;
        }
      }
      const decryptPassword=await decryptMessage(UserPassword.ciphertext, passwords.key, UserPassword.salt, UserPassword.iv)
      console.log(`Password for ${passwords.userId} is ${decryptPassword}`.green);
      userPage(loginObject);
    }
  } catch (err) {
    console.log(err.message);
  }
}
