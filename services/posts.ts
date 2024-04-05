import { FavoritePosts } from "../models/favoritePosts";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { ExchangePostType, PostType } from "../types/general";
import config from "config";
import { Threads } from "../models/threads";
import { ThreadMessages } from "../models/threadMessages";
import * as sequelize from "sequelize";
import { connect } from "../utils/db";
import { Op, Transaction } from "sequelize";
import { METERS_IN_MILE } from "../constants/constants";
import { checkPostTitile, isDraft } from "../utils/titleStatusUtils";

const PAGE_SIZE = config.get<number>("posts.perPage");

connect();

const COMMON_POST_ATTRIBUTES = [
  "id",
  "title",
  "category",
  "description",
  "is_public",
  "geo",
  "created_at",
  "author_id",
  "is_blocked",
  "city",
  "state",
  "location_name",
  "zip",
];

const buildGeoSearchCriteria = (radius: number, lat: number, lng: number) => {
  // ST_DWithin(geo, ST_SetSRID(ST_MakePoint(lng, lat), 4326), radius)
  return sequelize.fn(
    "ST_DWithin",
    sequelize.col("geo"),
    sequelize.fn("ST_SetSRID", sequelize.fn("ST_MakePoint", lng, lat), 4326),
    radius * METERS_IN_MILE,
    true
  );
};

export async function savePostToDb({
  user,
  post,
}: {
  user: { id: number; email: string };
  post: PostType;
}) {
  const createdPost = await Posts.create({
    author_id: user.id,
    title: checkPostTitile(post.title),
    category: post.category,
    description: post.description,
    geo: { type: "Point", coordinates: [post.lng, post.lat] },
    lat: post.lat,
    lng: post.lng,
    location_name: post.location_name,
    city: post.city,
    zip: post.zip,
    state: post.state,
    street: post.street,
    is_public: false,
  });
  await UserPosts.create({ user_id: user.id, post_id: createdPost.id });
  return createdPost;
}

type getPostsTypes = {
  category?: string | string[] | undefined;
  is_blocked: boolean | string[] | undefined;
  zip?: string | string[] | undefined;
  id?: number[];
  [Op.or]?: Object;
  is_public?: boolean;
};

type SearchProps = {
  page?: number;
  category?: string | string[] | undefined;
  zip?: string | string[] | undefined;
  lat?: string | string[] | undefined;
  lng?: string | string[] | undefined;
  radius?: string | string[] | undefined;
};

async function fillSearchParams(
  serarchParams: SearchProps,
  info: getPostsTypes & SearchProps
) {
  if (serarchParams.zip) {
    info.zip = serarchParams.zip;
  }
  if (serarchParams.category) {
    info.category = serarchParams.category;
  }
}

async function searchPostsWithGeoRadius(
  searchParams: SearchProps,
  user: { id: number } | null | undefined,
  info: getPostsTypes & SearchProps
) {
  const { zip, ...filters } = info;
  return await Posts.findAll({
    where: sequelize.and(
      buildGeoSearchCriteria(
        Number(searchParams.radius),
        Number(searchParams.lat),
        Number(searchParams.lng)
      ),
      filters,
      {
        is_public: true,
      }
    ),
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    include: {
      model: FavoritePosts,
      as: "favoriteUsers",
      where: { user_id: user?.id },
      required: false,
      attributes: ["id", "user_id", "post_id"],
    },
    attributes: COMMON_POST_ATTRIBUTES,
  });
}

function searchPostsWithoutGeo(
  searchParams: SearchProps | undefined,
  user: { id: number } | null | undefined,
  info: getPostsTypes & SearchProps
) {
  return Posts.findAll({
    where: {
      ...info,
    },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    include: {
      model: FavoritePosts,
      as: "favoriteUsers",
      where: { user_id: user?.id },
      required: false,
      attributes: ["id", "user_id", "post_id"],
    },
    attributes: COMMON_POST_ATTRIBUTES,
  });
}

export async function getPosts(
  user?: { id: number } | null | undefined,
  searchParams?: SearchProps
) {
  try {
    const info: getPostsTypes & SearchProps = {
      is_blocked: false,
    };

    if (searchParams) {
      await fillSearchParams(searchParams, info);
    }

    if (user) {
      info[Op.or] = [
        { is_public: true },
        { is_public: false, author_id: user?.id },
      ];

      if (
        searchParams &&
        searchParams.lat &&
        searchParams.lng &&
        searchParams.radius
      ) {
        const posts = await searchPostsWithGeoRadius(searchParams, user, info);

        const { zip, ...filters } = info;
        const count = await Posts.count({
          where: sequelize.and(
            buildGeoSearchCriteria(
              Number(searchParams.radius),
              Number(searchParams.lat),
              Number(searchParams.lng)
            ),
            filters,
            {
              is_public: true,
            }
          ),
        });

        return { posts, count };
      }

      const posts = await searchPostsWithoutGeo(searchParams, user, info);
      const count = await Posts.count({
        where: info,
      });

      return { posts, count };
    }

    info.is_public = true;
    const { zip, ...filters } = info;
    const posts = await Posts.findAll({
      where: searchParams?.radius
        ? sequelize.and(
            buildGeoSearchCriteria(
              Number(searchParams.radius),
              Number(searchParams.lat),
              Number(searchParams.lng)
            ),
            filters
          )
        : info,
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
      order: [
        ["created_at", "DESC"],
        ["title", "ASC"],
      ],
      attributes: COMMON_POST_ATTRIBUTES,
    });
    const count = await Posts.count({
      where: info,
    });
    return { posts, count };
  } catch (e) {
    console.log(e);
  }
}

export async function changeFavoritePost(userId: number, postId: number) {
  const info = { user_id: userId, post_id: postId };
  const foundFav = await FavoritePosts.findOne({ where: info });

  if (foundFav) {
    await FavoritePosts.destroy({ where: info });
    return false;
  } else {
    await FavoritePosts.create(info);
    return true;
  }
}

export async function getFavoritePosts(page: number, user: { id: number }) {
  const favPosts = await FavoritePosts.findAll({
    where: {
      user_id: user.id,
    },
    attributes: ["post_id"],
  });
  const ids = favPosts.map((item) => item.post_id);
  const posts = await Posts.findAll({
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    where: {
      id: ids,
      is_blocked: false,
      [Op.or]: [{ is_public: true }, { is_public: false, author_id: user.id }],
    },
    attributes: COMMON_POST_ATTRIBUTES,
  });

  return { posts, count: ids.length };
}

export async function getPost(postId: number, userId: number | undefined) {
  const where = {
    id: postId,
    ...(userId && {
      [Op.or]: [{ is_public: true }, { is_public: false, author_id: userId }],
    }),
    ...(!userId && {
      is_public: true,
    }),
  };
  return Posts.findOne({
    where,
    include: {
      model: FavoritePosts,
      as: "favoriteUsers",
      where: { user_id: userId },
      required: false,
      attributes: ["id", "user_id", "post_id"],
    },
  }) as Promise<ExchangePostType>;
}

export async function getUserPosts(page: number, userId: number) {
  const userPosts = await Posts.findAll({
    where: { author_id: userId },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    attributes: COMMON_POST_ATTRIBUTES,
  });

  const count = await Posts.count({ where: { author_id: userId } });

  return { userPosts, count };
}

export async function isAuthorCheck(
  userId: number,
  postId: number
): Promise<boolean> {
  const foundPost = await Posts.findOne({
    where: { id: postId, author_id: userId },
  });

  return Boolean(foundPost);
}

export async function deletePost(
  userId: number,
  postId: number,
  t: Transaction
) {
  try {
    const isAuthor = await isAuthorCheck(userId, postId);
    if (!isAuthor) {
      return;
    }

    await UserPosts.destroy({ where: { post_id: postId }, transaction: t });

    await FavoritePosts.destroy({
      where: {
        user_id: userId,
        post_id: postId,
      },
      transaction: t,
    });

    const thread = await Threads.findOne({
      where: { post_id: postId },
      transaction: t,
    });

    await Posts.destroy({
      where: {
        id: postId,
      },
      transaction: t,
    });

    if (!thread) {
      return;
    }

    await ThreadMessages.destroy({
      where: { thread_id: thread.id },
      transaction: t,
    });

    await Threads.destroy({ where: { post_id: postId }, transaction: t });

    return;
  } catch (err) {
    const error = err as Error;
    return error;
  }
}

export function changePostVisible(
  userId: number,
  title: string,
  postId: number,
  is_public: boolean
) {
  return Posts.update(
    { is_public, title },
    {
      where: { author_id: userId, id: postId },
    }
  );
}

export function editPost(
  postId: number,
  postTitle: string,
  postCategory: string,
  postDescription: string
) {
  return Posts.update(
    {
      title: postTitle,
      category: postCategory,
      description: postDescription,
      is_public: !isDraft(postTitle),
    },
    {
      where: { id: postId },
    }
  );
}

export async function deleteUserPosts(userId: number, t: Transaction) {
  try {
    const posts = await Posts.findAll({
      where: { author_id: userId },
      transaction: t,
    });

    if (posts.length === 0) {
      return;
    }
    const postIds = posts.map((item) => item.id);

    await Posts.destroy({
      where: {
        author_id: userId,
      },
      transaction: t,
    });

    const thread = await Threads.findAll({
      where: { post_id: postIds },
      transaction: t,
    });
    if (thread.length === 0) {
      return;
    }

    const threadIds = thread.map((item) => item.id);
    await ThreadMessages.destroy({
      where: { thread_id: threadIds },
      transaction: t,
    });

    await Threads.destroy({ where: { post_id: postIds }, transaction: t });

    return;
  } catch (err) {
    const error = err as Error;
    return error;
  }
}
