import { UserType } from "../types/general";
import { HttpError } from "../utils/HttpError";
import { compareSync, hashSync } from "bcryptjs";
import config from "config";
import { Users } from "../models/users";
import { connect } from "../utils/db";
import { FavoritePosts } from "../models/favoritePosts";
import { Transaction } from "sequelize";
import { UserPosts } from "../models/usersPosts";
import shortid from "shortid";

const saltLength = config.get<number>("hash.saltLength");
connect();

export async function saveUserToDatabase(user: UserType) {
  const isUsed = await isEmailAlreadyUsed(user.email);
  if (isUsed) {
    throw new HttpError(400, "email already used");
  }

  const userToSave = {
    email: user.email,
    password: hashSync(user.password, saltLength),
  };
  await Users.create(userToSave);
}

export async function changeEnabledForUser(token: string): Promise<void> {
  const isTokenExist = await isRightEmailToken(token);
  if (!isTokenExist) {
    throw new HttpError(404, "Token not found");
  }
  await Users.update(
    { is_enabled: true, email_verification_token: null },
    { where: { email_verification_token: token } }
  );
}

export async function isEmailAlreadyUsed(email: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      email,
    },
  });

  return users.length > 0;
}

export async function findUser(email: string) {
  const foundUser = await Users.findOne({ where: { email } });
  if (!foundUser) {
    return null;
  }

  return foundUser;
}

export async function getUser(userId: number) {
  const founfUser = Users.findOne({ where: { id: userId } });
  return founfUser;
}

export async function fillToken(email: string, reset_pwd_token: string) {
  await Users.update(
    { reset_pwd_token },
    {
      where: {
        email,
      },
    }
  );
}

export async function fillEmailToken(
  email: string,
  email_verification_token: string
) {
  await Users.update(
    { email_verification_token },
    {
      where: {
        email,
      },
    }
  );
}

export async function getUserByCredentials(
  user: UserType
): Promise<Users | null> {
  const foundUser = await Users.findOne({ where: { email: user.email } });
  if (!foundUser) {
    return null;
  }
  if (!compareSync(user.password, foundUser.password)) {
    return null;
  }
  return foundUser;
}

export async function isPasswordUsed(userId: number, password: string) {
  const foundUser = await Users.findOne({ where: { id: userId } });
  if (!foundUser) {
    return null;
  }

  return compareSync(password, foundUser.password);
}

export async function changePasswordByUserId(userId: number, password: string) {
  await Users.update(
    { password: hashSync(password, saltLength) },
    {
      where: {
        id: userId,
      },
    }
  );
}

export async function isRightToken(token: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      reset_pwd_token: token,
    },
  });

  return users.length > 0;
}

export async function isRightEmailToken(token: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      email_verification_token: token,
    },
  });

  return users.length > 0;
}

export async function changePassword(password: string, token: string) {
  const foundUser = await Users.findOne({ where: { reset_pwd_token: token } });
  if (!foundUser) {
    return null;
  }
  const result = await Users.update(
    { reset_pwd_token: null, password: hashSync(password, saltLength) },
    {
      where: {
        email: foundUser.email,
      },
    }
  );

  return result;
}

export async function deleteAccount(userId: number, t: Transaction) {
  const random = shortid.generate();
  try {
    await UserPosts.destroy({ where: { user_id: userId }, transaction: t });

    await FavoritePosts.destroy({
      where: {
        user_id: userId,
      },
      transaction: t,
    });

    const user = await Users.findOne({
      where: { id: userId },
      transaction: t,
    });
    if (!user) {
      return;
    }

    const updateEmail = random.concat("->", user.email);
    await Users.update(
      { email: updateEmail },
      { where: { id: userId }, transaction: t }
    );

    await Users.destroy({ where: { id: userId }, transaction: t });

    return;
  } catch (err) {
    const error = err as Error;
    return error;
  }
}

export async function changeLocation(userId: number, lat: number, lng: number) {
  await Users.update({ lat, lng }, { where: { id: userId } });
}

export async function getEmailVerificationToken(email: string) {
  const user = await Users.findOne({
    where: { email },
    attributes: ["email_verification_token"],
  });

  return user?.email_verification_token;
}
